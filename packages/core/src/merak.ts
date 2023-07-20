import { iframeInstance } from './iframe'
import type { LoadDone, NameSpace, Props, ProxyGlobals } from './types'
import type { CompileLoader } from './loaders'
import { createProxy } from './proxy'
import { MERAK_DATA_ID, MERAK_EVENT, MERAK_HOOK, MERAK_SHADE_STYLE, PERF_TIME } from './common'
import { debug, eventTrigger, getBaseUrl, scriptPrimise } from './utils'
import { MerakMap, getBodyStyle } from './helper'
import { LifeCycle } from './lifecycle'
import { cloneScript } from './compile'
import { Perf } from './perf'

export class Merak {
  /** 所有子应用共享 */
  static namespace: NameSpace = {}
  /** 生命周期 */
  public lifeCycle = new LifeCycle()

  public el: HTMLElement | null
  /** css隔离容器 */
  public shadowRoot: ShadowRoot
  /** shadowroot 下的 document */

  public sandDocument: HTMLElement | null

  /** iframe 容器 */
  public iframe: HTMLIFrameElement | null

  /** window代理 */
  public proxy: Window

  public perf = new Perf()
  /** 所有全局的代理 */
  public proxyMap = {

  } as unknown as ProxyGlobals

  /** 子应用的html */
  public template: string

  /** 加载器，仅spa使用 */
  public loader: CompileLoader | undefined

  /** 挂载数据 */
  public props: Props

  /** 子应用激活标志 */
  public activeFlag = false

  /** 子应用挂载次数 */
  public mountIndex = 0

  /** 子应用JS运行标志 */
  public execPromise: Promise<void> | false = false

  /** 子应用mount标志 */
  public mountFlag = false

  /** 子应用cache标志 */
  public cacheFlag = false

  /** 子应用中的虚拟变量名 */
  public fakeGlobalVar: string

  /** 配置文件地址，配置内联时为空 */
  public loaderOptions?: any

  /** 隔离的原生全局变量 */
  public nativeVars: string[]

  /** 隔离的自定义全局变量 */
  public customVars: string[]

  /** 防止重复加载 */
  private loadPromise: Promise<any>

  /** 子应用的 base */
  public baseUrl: string
  /**
   * 是否处于预加载状态
   * 'assets' 为预加载了资源
   * 'script' 为预执行了script，但不触发事件
  */
  public preloadStat: false | 'assets' | 'script' = false

  /** 缓存事件，卸载时被释放 */
  cacheEvent: (() => void)[] = []

  constructor(public id: string, public url: string, public options: {
    loader?: CompileLoader
    proxy?: ProxyGlobals
    loaderOptions?: any
    iframe?: string
  } = {},
  ) {
    if (MerakMap.has(id)) {
      if (__DEV__)
        console.warn(`[merak]: "${id}" already exists`)

      return MerakMap.get(id) as Merak
    }
    MerakMap.set(id, this)
    this.baseUrl = getBaseUrl(url)
    const { proxy = createProxy(id, this.baseUrl), loaderOptions, loader } = options
    this.loaderOptions = loaderOptions
    this.loader = loader

    for (const i in proxy)
      this.proxyMap[i] = typeof proxy[i] === 'function' ? proxy[i] : new Proxy({} as any, proxy[i])

    const windowProxy = this.proxy = this.proxyMap.window as any

    /**
     * @experiment
     * work for customVars
     */

    this.proxyMap.__m_p__ = (k: string) => new Proxy(() => { }, {
      get(_, p) {
        debug(`get [${p as string}] from ${k}`, id)
        const v = windowProxy[k][p]
        return typeof v === 'function' ? v.bind(windowProxy) : v
      },
      has(_, p) {
        return p in windowProxy[k]
      },
      set(_, p, v) {
        windowProxy[k][p] = v
        return true
      },
      apply(_, t, a) {
        return windowProxy[k](...a)
      },
    })
  }

  // 所有merak实例共享的错误处理
  static errorHandler({ type, error }: { type: string; error: Error; instance?: Merak }) {
    if (__DEV__)
      console.error(error)
    else
      console.error(`[merak] ${type}:${error.message}`)
  }

  // 实例自身的错误处理，默认调用共享处理
  public errorHandler({ type, error }: { type: string; error: Error }) {
    Merak.errorHandler({ type, error, instance: this })
  }

  get namespace() {
    return Merak.namespace
  }

  protected execHook<Stage extends keyof LifeCycle>(stage: Stage, params?: Omit<Parameters<LifeCycle[Stage]>[0], 'instance'>) {
    const args = { ...params }

    // @ts-expect-error lifecycle work
    return this.lifeCycle[stage]?.(args)
  }

  protected cleanEvents() {
    while (this.cacheEvent.length > 0)
      this.cacheEvent.pop()!()
  }

  // Preloading does not fire an event, but it does fire a hook
  protected eventTrigger(el: HTMLElement | Window | Document, eventName: string) {
    if (!this.preloadStat)
      eventTrigger(el, eventName, this)
  }

  setGlobalVars(fakeGlobalVar: string, nativeVars: string[], customVars: string[]) {
    this.fakeGlobalVar = fakeGlobalVar
    this.nativeVars = nativeVars
    this.customVars = customVars
  }

  active() {
    if (!this.activeFlag) {
      if (!this.fakeGlobalVar)
        return

      if (this.iframe?.contentWindow)
        (this.iframe.contentWindow as Window)[this.fakeGlobalVar] = this.proxy
      else window[this.fakeGlobalVar] = this.proxy
      this.activeFlag = true
    }
  }

  async load() {
    if (!this.loader)
      return
    if (this.loadPromise)
      return this.loadPromise
    const { url, loaderOptions } = this
    this.perf.record(PERF_TIME.LOAD)
    return this.loadPromise = (this.loader!.load(url, loaderOptions) as Promise<LoadDone>).then((loadRes) => {
      if (loadRes instanceof Error) {
        this.errorHandler?.({ type: 'loadError', error: loadRes as Error })
      }
      else {
        this.perf.record(PERF_TIME.LOAD)
        const { template, fakeGlobalVar, nativeVars, customVars } = this.execHook(MERAK_HOOK.LOAD, loadRes) || loadRes

        this.template = template
        this.setGlobalVars(fakeGlobalVar, nativeVars, customVars)
      }
    })
  }

  private mountTemplateAndScript() {
    this.execHook(MERAK_HOOK.BEFORE_MOUNT)
    this.active()
    if (!this.cacheFlag) {
      if (!this.sandDocument) {
        this.sandDocument = document.importNode(window.document.implementation.createHTMLDocument('').documentElement, true)
        if (this.template) // template
          this.sandDocument.innerHTML = this.template
      }

      if (this.mountIndex === 0) {
        const shade = document.createElement('div')
        shade.setAttribute('style', MERAK_SHADE_STYLE)
        shade.setAttribute('id', 'merak-shade')

        const body = this.sandDocument.querySelector('body')!
        body.setAttribute('style', getBodyStyle())
        body.appendChild(shade)
      }

      if (this.loader) {
        // mount script on body or iframe
        if (!this.execPromise) {
          if (this.preloadStat !== 'assets') {
            const originScripts = Array.from(this.sandDocument.querySelectorAll('script'))
            const scripts = originScripts.filter((script) => {
              !this.iframe && script.remove()
              return !script.hasAttribute('merak-ignore') && script.type !== 'importmap'
            }).map(script => cloneScript(script, this.fakeGlobalVar, this.nativeVars, this.customVars))

            this.execHook(MERAK_HOOK.TRANSFORM_SCRIPT, { originScripts, scripts })
            let r: () => void
            this.execPromise = new Promise((resolve) => {
              r = resolve
            })
            // only invoke mount event after all scripts load/fail
            Promise.all(scripts.map(scriptPrimise)).catch((e) => {
              return this.errorHandler?.({ type: 'scriptError', error: e })
            }).finally(() => {
              this.perf.record(PERF_TIME.BOOTSTRAP)
              r()

              this.eventTrigger(window, MERAK_EVENT.MOUNT + this.id)
              this.execHook(MERAK_HOOK.AFTER_MOUNT)
            });
            // TODO JS queue
            (this.iframe?.contentDocument || this.sandDocument).querySelector('body')?.append(...scripts)
            this.perf.record(PERF_TIME.BOOTSTRAP)
          }
        }
        else {
          this.eventTrigger(window, MERAK_EVENT.RELUNCH + this.id)
        }
      }
    }
    else {
      this.eventTrigger(window, MERAK_EVENT.SHOW + this.id)
    }

    this.execHook(MERAK_HOOK.TRANSFORM_DOCUMENT, { ele: this.sandDocument! })
    this.shadowRoot.appendChild(this.sandDocument!)
    // execPromise  will be false if it is the first time to mount
    if (this.execPromise) {
      this.eventTrigger(window, MERAK_EVENT.MOUNT + this.id)
      this.execHook(MERAK_HOOK.AFTER_MOUNT)
    }
  }

  mount() {
    if (this.mountFlag)
      return

    if (this.options.iframe && !this.iframe) {
      iframeInstance.add(this.options.iframe).then((el) => {
        this.iframe = el
        this.mountTemplateAndScript()
      })
    }

    else { this.mountTemplateAndScript() }
    if (!this.preloadStat)
      this.mountIndex++
    this.mountFlag = true
  }

  // called directly by shadow
  unmount(isKeepAlive: boolean) {
    if (!this.mountFlag)
      return

    this.execHook(MERAK_HOOK.BEFORE_UNMOUNT)
    this.mountFlag = false
    // just a flag
    this.cacheFlag = isKeepAlive
    if (!isKeepAlive) {
      this.eventTrigger(window, MERAK_EVENT.DESTROY + this.id)
      // in iframe mode, main app can decide to destroy the sub
      if (this.iframe)
        this.deactive()
    }
    else { this.eventTrigger(window, MERAK_EVENT.HIDDEN + this.id) }

    this.eventTrigger(window, MERAK_EVENT.UNMOUNT + this.id)

    if (this.el) {
      this.el.remove()
      this.el = null
    }

    this.execHook(MERAK_HOOK.AFTER_UNMOUNT)
  }

  // Called by the subapplication
  deactive() {
    if (!this.activeFlag)
      return

    this.execHook(MERAK_HOOK.DESTROY)
    if (this.template)
      this.template = this.sandDocument!.innerHTML
    this.activeFlag = false
    if (this.iframe) {
      const isIframeDestroy = iframeInstance.remove(this.options.iframe as string)
      this.iframe = null
      if (isIframeDestroy)
        this.execPromise = false
    }
    else {
      delete window[this.fakeGlobalVar]
    }
    this.sandDocument = null
    this.cleanEvents()
  }
}

/**
 * @experiment just a try
 */

export function preload(type: 'script' | 'assets', ...args: ConstructorParameters<typeof Merak>) {
  const app = new Merak(...args)
  if (!app.execPromise) {
    const el = document.createElement('merak-app')
    el.setAttribute(MERAK_DATA_ID, args[0])
    el.setAttribute('style', 'display:none')
    app.el = el
    app.preloadStat = type

    document.body.appendChild(el)
  }
  return app
}

export function setErrorHandler(cb: (arg: { type: 'missInstance' | 'missProperty' | 'loadError' | 'hasMount' | 'scriptError' | string; error: Error; instance?: Merak }) => void) {
  Merak.errorHandler = cb
}
