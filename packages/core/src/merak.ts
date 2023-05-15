import { iframeInstance } from './iframe'
import type { LoadDone, MerakConfig, ProxyGlobals } from './types'
import type { PureLoader } from './loaders'
import { createProxy } from './proxy'
import { MERAK_DATA_ID, MERAK_EVENT, MERAK_SHADE_STYLE } from './common'
import { eventTrigger, scriptPrimise } from './utils'
import { MerakMap, getBodyStyle } from './helper'
import { LifeCycle } from './lifecycle'
import { cloneScript } from './compile'
import { Perf } from './perf'

export class Merak {
  /** 所有子应用共享 */
  static namespace: Record<string, any> = {}
  /** 生命周期 */
  lifeCycle = new LifeCycle()

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
  public loader: PureLoader | undefined

  /** 挂载数据 */
  public props: any

  /** 子应用激活标志 */
  public activeFlag = false

  /** 子应用挂载次数 */
  public mountIndex = 0

  /** 子应用JS运行标志 */
  public execFlag = false

  /** 子应用mount标志 */
  public mountFlag = false

  /** 子应用cache标志 */
  public cacheFlag = false

  /** 子应用中的虚拟变量名 */
  public fakeGlobalVar: string

  /** 配置文件地址，配置内联时为空 */
  public configOrUrl?: string | MerakConfig

  /** 隔离的原生全局变量 */
  public nativeVars: string[]

  /** 隔离的自定义全局变量 */
  public customVars: string[]

  /** 防止重复加载 */
  private loadPromise: Promise<any>

  /** 防止重复执行 */
  public execPromise: Promise<any>
  /** 缓存事件，卸载时被释放 */
  cacheEvent: (() => void)[] = []

  constructor(public id: string, public url: string, public options: {
    loader?: PureLoader
    proxy?: ProxyGlobals
    configOrUrl?: string | MerakConfig
    iframe?: string
  } = {},
  ) {
    if (MerakMap.has(id)) {
      if (__DEV__)
        throw new Error(`"${id}" already exists`)
      return MerakMap.get(id) as Merak
    }
    MerakMap.set(id, this)

    const { proxy = createProxy(id, url), configOrUrl, loader } = options
    this.configOrUrl = configOrUrl
    this.loader = loader

    for (const i in proxy)
      this.proxyMap[i] = typeof proxy[i] === 'function' ? proxy[i] : new Proxy({} as any, proxy[i])

    const windowProxy = this.proxy = this.proxyMap.window as any

    /**
     * @experiment
     * work for customVars in dev mode
     */

    this.proxyMap.__m_p__ = (k: string) => new Proxy(() => {}, {
      get(_, p) {
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

  static errorHandler({ type, message }: { type: string; message: string; instance?: Merak }) {
    console.error(`[merak] ${type}:${message}`)
  }

  public errorHandler({ type, message }: { type: string; message: string }) {
    Merak.errorHandler({ type, message, instance: this })
  }

  get namespace() {
    return Merak.namespace
  }

  protected execHook<Stage extends keyof LifeCycle>(stage: Stage, params?: Omit<Parameters<LifeCycle[Stage]>[0], 'instance'>) {
    const args = { ...params }

    // @ts-expect-error lifecycle work
    return this.lifeCycle[stage]?.(args)
  }

  // 错误处理

  protected cleanEvents() {
    while (this.cacheEvent.length > 0)
      this.cacheEvent.pop()!()
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
    const { url, configOrUrl } = this
    this.perf.record('load')
    return this.loadPromise = (this.loader!.load(url, configOrUrl) as Promise<LoadDone>).then((loadRes) => {
      if (loadRes instanceof Error) {
        this.errorHandler?.({ type: 'loadError', message: loadRes.message })
      }
      else {
        this.perf.record('load')
        const { template, fakeGlobalVar, nativeVars, customVars } = this.execHook('load', loadRes) || loadRes

        this.template = template
        this.setGlobalVars(fakeGlobalVar, nativeVars, customVars)
      }
    })
  }

  private mountTemplateAndScript() {
    this.execHook('beforeMount')
    this.active()

    if (!this.cacheFlag) {
      this.sandDocument = document.importNode(window.document.implementation.createHTMLDocument('').documentElement, true)
      if (this.template) // template
        this.sandDocument.innerHTML = this.template
      if (this.mountIndex === 0) {
        this.perf.record('bootstrap')

        const shade = document.createElement('div')
        shade.setAttribute('style', MERAK_SHADE_STYLE)
        this.sandDocument.insertBefore(shade, this.sandDocument.firstChild)
        const body = this.sandDocument.querySelector('body')!
        body.setAttribute('style', getBodyStyle())
      }

      // work for spa
      if (this.loader) {
        // mount script on body or iframe
        if (!this.execFlag) {
          let r: () => void
          this.execPromise = new Promise<void>((resolve) => {
            r = resolve
          })
          const originScripts = Array.from(this.sandDocument.querySelectorAll('script'))
          const scripts = originScripts.filter((script) => {
            !this.iframe && script.remove()
            return !script.hasAttribute('merak-ignore') && script.type !== 'importmap'
          }).map(script => cloneScript(script, this.fakeGlobalVar, this.nativeVars, this.customVars))

          this.execHook('transformScript', { originScripts, scripts });
          // TODO JS queue
          (this.iframe?.contentDocument || this.sandDocument).querySelector('body')?.append(...scripts)
          // only invoke mount event after all scripts load/fail
          Promise.all(scripts.map(scriptPrimise)).catch((e) => {
            return this.errorHandler?.({ type: 'scriptError', message: e.message })
          }).finally(() => {
            this.perf.record('bootstrap')
            r()
            this.execFlag = true
            eventTrigger(window, MERAK_EVENT.MOUNT + this.id)
          })
        }
        else {
          eventTrigger(window, MERAK_EVENT.RELUNCH + this.id)
        }
      }
    }
    else {
      eventTrigger(window, MERAK_EVENT.SHOW + this.id)
    }

    this.execHook('tranformDocument', { ele: this.sandDocument! })
    this.shadowRoot.appendChild(this.sandDocument!)
    // ExecFlag will be false if it is the first time to mount
    this.execFlag && eventTrigger(window, MERAK_EVENT.MOUNT + this.id)
    this.execHook('afterMount')
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

    this.mountIndex++
    this.mountFlag = true
  }

  // called directly by shadow
  unmount(isKeepAlive: boolean) {
    this.cacheFlag = isKeepAlive

    this.execHook('beforeUnmount')
    this.mountFlag = false

    if (!isKeepAlive)
      this.destroy()
    else
      eventTrigger(window, MERAK_EVENT.HIDDEN + this.id)

    eventTrigger(window, MERAK_EVENT.UNMOUNT + this.id)

    if (this.el) {
      this.el.remove()
      this.el = null
    }
    this.execHook('afterUnmount')
  }

  destroy() {
    eventTrigger(window, MERAK_EVENT.DESTROY + this.id)
    this.execHook('destroy')
    if (this.template)
      this.template = this.sandDocument!.innerHTML
    this.activeFlag = false
    if (this.iframe) {
      const isIframeDestroy = iframeInstance.remove(this.options.iframe as string)
      this.iframe = null
      if (isIframeDestroy)
        this.execFlag = false
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

export function preloadApp(...args: ConstructorParameters<typeof Merak>) {
  const app = new Merak(...args)
  const el = document.createElement('merak-app')
  el.setAttribute(MERAK_DATA_ID, args[0])
  el.setAttribute('style', 'display:none')
  app.el = el
  document.body.appendChild(el)
  return app
}

export function setErrorHandler(cb: (arg: { type: 'missInstance' | 'missProperty' | 'loadError' | 'hasMount' | 'scriptError' | string; message: string; instance?: Merak }) => void) {
  Merak.errorHandler = cb
}
