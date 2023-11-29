import { iframeInstance } from './iframe'
import type { LoadDone, NameSpace, Props, ProxyFn, ProxyGlobals } from './types'
import { type Loader } from './loaders'
import { createProxy } from './proxy'
import { MERAK_CYCLE, MERAK_DATA_ID, MERAK_EVENT, MERAK_SHADE_STYLE, PERF_TIME } from './common'
import { debug, eventTrigger, scriptPromise } from './utils'
import { MerakMap } from './helper'
import { LifeCycle } from './lifecycle'
import { cloneScript } from './compile'
import { Perf } from './perf'

export class Merak<L extends Loader = Loader> {
  /** 所有子应用共享 */
  static namespace: NameSpace = {}
  /** 已经被占用的变量名 */
  static fakeGlobalVars = new Set<string>()

  /** 生命周期 */
  public lifeCycle = new LifeCycle()
  /** work for preload */
  public el: HTMLElement | null
  /** css隔离容器 */
  public shadowRoot: ShadowRoot | null
  /** shadowroot 下的 document */
  public sandHtml: HTMLHtmlElement | null
  /** iframe 容器 */
  public iframe: HTMLIFrameElement | null
  /** window代理 */
  public proxy: Window
  /** 性能管理器 */
  public perf = new Perf()
  /** 所有全局的代理 */
  public proxyMap = {} as unknown as ProxyGlobals

  public sheets = [] as CSSStyleSheet[]
  /** 子应用的html */
  public template: string

  /** 加载器，负责加载html */
  public loader: L | undefined

  /** 挂载数据 */
  public props: Props = {}

  /** 子应用激活标志 */
  public activeFlag = false

  /** 子应用挂载次数 */
  public mountIndex = 0

  /** 子应用JS运行标志 */
  public execPromise: Promise<void> | boolean = false

  /** 子应用mount标志 */
  public mountFlag = false

  /** 子应用cache标志 */
  public cacheFlag = false

  /** 子应用中的虚拟变量名 */
  public fakeGlobalVar: string

  /** 传给loader的options */
  public loaderOptions?: any

  /** 隔离的原生全局变量 */
  public nativeVars: string[]

  /** 隔离的自定义全局变量 */
  public customVars: string[]

  /** 快速切换页面时，当卸载->挂载时间小于这个数，不会触发子应用钩子.timeout为0时，则不走定时器，直接调用 */
  public timeout: number

  protected timer: NodeJS.Timeout | null
  /** 防止重复加载 */
  protected loadPromise?: Promise<any>

  /** 子应用的 base */
  public baseUrl: string
  /**
   * 是否处于预加载状态
   * 'assets' 为预加载了资源
   * 'script' 为预执行了script，但不触发钩子
  */
  public preloadStat: false | 'assets' | 'script' = false

  /** 缓存事件，卸载时被释放 */
  // @todo
  sideEffects: (() => void)[] = []

  constructor(
    /** 分配的名字，等于data-merak-id */public id: string,
    /** 源url */public url: string,
    public options: {
      loader?: L
      // 沙箱
      proxy?: ProxyFn
      loaderOptions?: any
      // iframe id
      iframe?: string
      timeout?: number
    } = {

    },
  ) {
    if (MerakMap.has(id)) {
      debug('already exists', id)

      return MerakMap.get(id) as Merak<L>
    }
    MerakMap.set(id, this)
    this.baseUrl = new URL('./', url).href.slice(0, -1)
    const { proxy = createProxy, loaderOptions, loader, timeout = 0 } = options
    this.timeout = timeout
    this.loaderOptions = loaderOptions
    this.loader = loader

    const proxyMap = proxy({ id, baseUrl: this.baseUrl })
    for (const i in proxyMap)
      this.proxyMap[i] = typeof proxyMap[i] === 'function' ? proxyMap[i] : new Proxy({} as any, proxyMap[i])

    const windowProxy = this.proxy = this.proxyMap.window as any

    /**
     * @experiment
     * work for customVars
     */

    this.proxyMap.__m_p__ = (k: string) => new Proxy(() => { }, {
      get(_, p) {
        debug(`get [${typeof p === 'symbol' ? p.toString() : p}] from ${k}`, id)
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

  // 公共错误处理
  static errorHandler({ type, error }: { type: string; error: Error; instance?: Merak }) {
    if (__DEV__)
      console.error(error)
    else
      console.error(`[merak] ${type}:${error.message}`)
  }

  // 实例自身的错误处理，默认调用公共错误处理
  public errorHandler({ type, error }: { type: string; error: Error }) {
    Merak.errorHandler({ type, error, instance: this })
  }

  // 获得公共命名空间
  get namespace() {
    return Merak.namespace
  }

  protected execCycle<Stage extends keyof LifeCycle>(stage: Stage, param?: Omit<Parameters<LifeCycle[Stage]>[0], 'instance'>) {
    const args = { ...(param || {}), instance: this }
    debug(`execCycle '${stage}'`, this.id)
    // @ts-expect-error lifecycle work
    return this.lifeCycle[stage]?.(args)
  }

  protected cleanSideEffect() {
    while (this.sideEffects.length > 0)
      this.sideEffects.pop()!()
  }

  // Preloading does not fire an event, but it does fire a hook
  protected eventTrigger(el: HTMLElement | Window | Document, eventName: string, detail?: string) {
    if (!this.preloadStat) {
      if (!this.timeout) {
        eventTrigger(el, eventName + this.id, detail)

        return
      }
      if (eventName === MERAK_EVENT.UNMOUNT) {
        if (!this.timer) {
          this.timer = setTimeout(() => {
            eventTrigger(el, eventName + this.id, detail)
            this.timer = null
          }, this.timeout)
        }
        return
      }
      if (eventName === MERAK_EVENT.MOUNT) {
        if (this.timer) {
          clearTimeout(this.timer!)
          this.timer = null
        }
        else {
          eventTrigger(el, eventName + this.id, detail)
        }
      }
    }
  }

  setGlobalVars(fakeGlobalVar: string, nativeVars: string[], customVars: string[]) {
    if (!this.options.iframe) {
      if (Merak.fakeGlobalVars.has(fakeGlobalVar)) {
        Merak.errorHandler({ type: 'duplicateName', error: new Error(`fakeglobalVar '${fakeGlobalVar}' has been defined`) })
        return
      }
      Merak.fakeGlobalVars.add(fakeGlobalVar)
    }
    debug(`set fakerGlobalVar '${fakeGlobalVar}'`, this.id)
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
    if (!this.loadPromise) {
      const { url, loaderOptions } = this
      this.perf.record(PERF_TIME.LOAD)
      this.loadPromise = (this.loader!.load(url, loaderOptions) as Promise<LoadDone>).then((loadRes) => {
        if (loadRes instanceof Error) {
          this.errorHandler({ type: 'loadError', error: loadRes as Error })
          this.loadPromise = undefined
        }
        else {
          this.perf.record(PERF_TIME.LOAD)

          const { template, fakeGlobalVar, nativeVars, customVars } = this.execCycle(MERAK_CYCLE.LOAD, loadRes) || loadRes
          this.template = template
          this.setGlobalVars(fakeGlobalVar, nativeVars, customVars)
        }
      })
    }
    return this.loadPromise
  }

  private mountTemplateAndScript() {
    this.shadowRoot!.adoptedStyleSheets = this.sheets
    this.execCycle(MERAK_CYCLE.BEFORE_MOUNT)
    this.active()
    // work for style flicker
    if (!this.sandHtml) {
      this.sandHtml = document.createElement('html')

      this.sandHtml.innerHTML = this.template || '<head></head><body></body>'
    }
    if (!this.cacheFlag) {
      if (this.mountIndex === 0) {
        // maybe shade is meaningless
        const shade = document.createElement('div')
        shade.setAttribute('style', MERAK_SHADE_STYLE)
        shade.setAttribute('id', 'merak-shade')
        const body = this.sandHtml.querySelector('body')!
        body.appendChild(shade)
      }

      if (this.loader) {
        // mount script on body or iframe
        if (!this.execPromise) {
          if (this.preloadStat !== 'assets') {
            const originScripts = Array.from(this.sandHtml.querySelectorAll('script'))
            const scripts = originScripts.filter((script) => {
              !this.iframe && script.remove()
              return !script.hasAttribute('merak-ignore') && script.type !== 'importmap'
            }).map(script => cloneScript(script, this.fakeGlobalVar, this.nativeVars, this.customVars))
            this.execCycle(MERAK_CYCLE.TRANSFORM_SCRIPT, { originScripts, scripts })
            let r: () => void
            this.execPromise = new Promise((resolve) => {
              r = resolve
            })

            // only invoke mount event after all scripts load/fail
            Promise.all(scripts.map(scriptPromise)).catch((e) => {
              return this.errorHandler?.({ type: 'scriptError', error: e })
            }).finally(() => {
              this.perf.record(PERF_TIME.BOOTSTRAP)
              r()
              this.execPromise = true
              this.eventTrigger(window, MERAK_EVENT.MOUNT, 'init')
              this.execCycle(MERAK_CYCLE.AFTER_MOUNT)
            });
            // TODO JS queue
            (this.iframe?.contentDocument || this.sandHtml).querySelector('body')?.append(...scripts)
            this.perf.record(PERF_TIME.BOOTSTRAP)
          }
        }
        else {
          this.eventTrigger(window, MERAK_EVENT.MOUNT, 'relunch')
        }
      }
      else {
        // work for block
        this.execPromise = true
      }
    }
    else {
      this.eventTrigger(window, MERAK_EVENT.MOUNT, 'show')
    }

    this.execCycle(MERAK_CYCLE.TRANSFORM_DOCUMENT, { ele: this.sandHtml! })

    this.shadowRoot!.appendChild(this.sandHtml!)

    // execPromise is not ture if it is the first time to mount
    if (this.execPromise === true) {
      // this.eventTrigger(window, MERAK_EVENT.MOUNT)
      this.execCycle(MERAK_CYCLE.AFTER_MOUNT)
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

  storeCSSLink() {
    this.sandHtml?.querySelectorAll('link[rel=stylesheet]').forEach(async (n) => {
      const href = n.getAttribute('href')
      if (href) {
        const res = await fetch(href)
        const text = await res.text()
        const sheet = new CSSStyleSheet({ baseURL: href })
        sheet.replace(text)
        this.sheets.push(sheet)
        n.remove()
      }
    })
  }

  // called directly by shadow
  unmount(flag: string) {
    if (!this.mountFlag)
      return

    this.execCycle(MERAK_CYCLE.BEFORE_UNMOUNT)
    this.eventTrigger(window, MERAK_EVENT.UNMOUNT, flag)
    this.mountFlag = false
    // just a flag
    const isKeepAlive = flag === 'destroy'
    this.cacheFlag = isKeepAlive

    if (!isKeepAlive && this.iframe)
      this.deactive()

    if (this.el) {
      this.el.remove()
      this.el = null
    }
    this.shadowRoot = null

    this.execCycle(MERAK_CYCLE.AFTER_UNMOUNT)
  }

  deactive() {
    if (!this.activeFlag)
      return
    // make sure
    if (this.template)
      this.template = this.sandHtml!.innerHTML
    this.cleanSideEffect()
    this.cacheFlag = false
    this.execCycle(MERAK_CYCLE.DEACTIVE)

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

    this.sandHtml = null
  }

  // 彻底销毁应用
  destroy() {
    if (this.mountFlag) {
      debug('must destroy after instance unount')
      return
    }
    if (this.timer)
      clearTimeout(this.timer)
    this.cleanSideEffect()

    if (this.options.iframe)
      Merak.fakeGlobalVars.delete(this.fakeGlobalVar)
    // @ts-expect-error to gc
    this.proxy = this.proxyMap = this.delayEvents = this.sandHtml = this.props = this.sideEffects = this.loader = this.nativeVars = this.customVars = this.perf = this.lifeCycle = null
    MerakMap.delete(this.id)
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
