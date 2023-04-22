import { iframeInstance } from './iframe'
import type { LoadDone, ProxyGlobals } from './types'
import type { PureLoader } from './loaders'
import { createProxy } from './proxy'
import { MERAK_EVENT_DESTROY, MERAK_EVENT_HIDDEN, MERAK_EVENT_MOUNT, MERAK_EVENT_RELUNCH, MERAK_SHADE_STYLE } from './common'
import { eventTrigger, scriptPrimise } from './utils'
import { MerakMap, getBodyStyle } from './helper'
import { LifeCycle } from './lifecycle'
import { cloneScript } from './compile'
import type { Perf } from './perf'

export class Merak {
  /** 所有子应用共享 */
  static namespace: Record<string, any> = {}
  /** 共用生命周期 */
  static lifeCycle = new LifeCycle()
  /** css隔离容器 */
  public shadowRoot: ShadowRoot
  /** shadowroot 下的 document */

  public sandDocument: HTMLElement | null

  /** iframe 容器 */
  public iframe: HTMLIFrameElement | null

  /** window代理 */
  public proxy: Window

  public perf: Perf
  /** 所有全局的代理 */
  public proxyMap = {} as unknown as ProxyGlobals

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

  /** 初次挂载时间 */
  public timestamp: number

  /** 子应用JS运行标志 */
  public execFlag = false

  /** 子应用mount标志 */
  public mountFlag = false

  /** 子应用cache标志 */
  public cacheFlag = false

  /** 子应用中的虚拟变量名 */
  public fakeGlobalVar: string

  /** 配置文件地址，配置内联时为空 */
  public configUrl?: string

  /** 隔离的全局变量 */
  public globalVars: string[]

  // /** 是否被预渲染 */
  // public isRender = false

  /** 防止重复加载 */
  private loadPromise: Promise<any>

  /** 缓存事件，卸载时被释放 */
  private cacheEvent: Function[] = []

  constructor(public id: string, public url: string, public options: {
    loader?: PureLoader
    proxy?: ProxyGlobals
    configUrl?: string
    iframe?: string
  } = {},
  ) {
    if (MerakMap.has(id)) {
      if (__DEV__)
        throw new Error(`"${id}" already exists`)
      return MerakMap.get(id) as Merak
    }
    MerakMap.set(id, this)

    const { proxy = createProxy(id, url), configUrl, loader } = options
    this.configUrl = configUrl
    this.loader = loader

    for (const i in proxy)
      this.proxyMap[i] = typeof proxy[i] === 'function' ? proxy[i] : new Proxy({} as any, proxy[i])

    this.proxy = this.proxyMap.window as any
  }

  get namespace() {
    return Merak.namespace
  }

  protected execHook<Stage extends keyof LifeCycle>(stage: Stage, params?: Omit<Parameters<LifeCycle[Stage]>[0], 'instance'>) {
    const args = { ...params, instance: this }

    // @ts-expect-error lifecycle work
    return Merak.lifeCycle[stage]?.(args)
  }

  protected cleanEvents() {
    while (this.cacheEvent.length > 0)
      this.cacheEvent.pop()!()
  }

  setGlobalVar(fakeGlobalVar: string) {
    this.fakeGlobalVar = fakeGlobalVar
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
    if (this.loadPromise)
      return this.loadPromise
    const { id, url, configUrl } = this
    this.perf.record('load')
    return this.loadPromise = (this.loader!.load(id, url, configUrl) as Promise<LoadDone>).then((loadRes) => {
      if (loadRes instanceof Error) {
        this.execHook('errorHandler', { type: 'loadError', error: loadRes as any })
      }

      else {
        this.perf.record('load')
        const { template, fakeGlobalVar, globals } = loadRes

        this.template = template
        this.globalVars = globals
        this.setGlobalVar(fakeGlobalVar)
      }
    })
  }

  private mountTemplateAndScript(ele?: ParentNode) {
    this.execHook('beforeMount')
    this.active()

    if (!this.cacheFlag) {
      this.sandDocument = document.importNode(window.document.implementation.createHTMLDocument('').documentElement, true)
      if (this.mountIndex === 0) {
        this.perf.record('bootstrap')

        this.timestamp = Date.now()
        const shade = document.createElement('div')
        shade.setAttribute('style', MERAK_SHADE_STYLE)
        this.sandDocument.insertBefore(shade, this.sandDocument.firstChild)
        const body = this.sandDocument.querySelector('body')!
        body.setAttribute('style', getBodyStyle())
      }
      // work for spa
      if (this.loader) {
        if (!this.template) {
          // if (__DEV__)
          //   throw new Error(`"${this.id}" should load before mount`)
          return
        }
        // template
        this.sandDocument.innerHTML = this.template
        // mount script on body or iframe
        if (!this.execFlag) {
          const originScripts = Array.from(this.sandDocument.querySelectorAll('script'))
          const scripts = originScripts.filter((script) => {
            !this.iframe && script.remove()
            return !script.hasAttribute('merak-ignore') && script.type !== 'importmap'
          }).map(script => cloneScript(script, this.fakeGlobalVar, this.globalVars))

          this.execHook('transformScript', { originScripts, scripts });
          // TODO JS queue
          (this.iframe?.contentDocument || this.sandDocument).querySelector('body')?.append(...scripts)
          // only invoke mount event after all scripts load/fail
          Promise.all(scripts.map(scriptPrimise)).catch((e) => {
            return this.execHook('errorHandler', { type: 'scriptError', error: e })
          }).finally(() => {
            this.perf.record('bootstrap')

            this.execFlag = true
            eventTrigger(window, MERAK_EVENT_MOUNT + this.id)
          })
        }
        else {
          eventTrigger(window, MERAK_EVENT_RELUNCH + this.id)
        }
      }
      // work for ssr
      if (ele) {
        // mount script on body or iframe
        const originScripts = [...ele.querySelectorAll('script')]
        const scripts = originScripts.filter((script) => {
          !this.iframe && script.remove()
          if (this.execFlag)
            return false

          return !script.hasAttribute('merak-ignore') && script.type !== 'importmap'
        })
        this.sandDocument.querySelector('body')?.appendChild(ele)

        if (!this.execFlag) {
          this.execHook('transformScript', { originScripts, scripts });

          (this.iframe ? this.iframe.contentDocument : this.sandDocument)!.querySelector('body')!.append(...scripts)
          Promise.all(scripts.map(scriptPrimise)).catch((e) => {
            return this.execHook('errorHandler', { type: 'scriptError', error: e })
          }).finally(() => {
            this.perf.record('bootstrap')

            this.execFlag = true
            eventTrigger(window, MERAK_EVENT_MOUNT + this.id)
          })
        }
        else {
          eventTrigger(window, MERAK_EVENT_RELUNCH + this.id)
        }
      }
    }

    this.execHook('tranformDocument', { ele: this.sandDocument! })
    this.shadowRoot.appendChild(this.sandDocument!)
    // ExecFlag will be false if it is the first time to mount
    this.execFlag && eventTrigger(window, MERAK_EVENT_MOUNT + this.id)
    this.execHook('afterMount')
  }

  mount(ele?: HTMLElement) {
    if (this.mountFlag)
      return

    if (this.options.iframe && !this.iframe) {
      iframeInstance.add(this.options.iframe).then((el) => {
        this.iframe = el
        this.mountTemplateAndScript(ele)
      })
    }

    else { this.mountTemplateAndScript(ele) }

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
      eventTrigger(window, MERAK_EVENT_HIDDEN + this.id)

    this.execHook('afterUnmount')
  }

  destroy() {
    eventTrigger(window, MERAK_EVENT_DESTROY + this.id)
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

export function beforeMount(cb: LifeCycle['beforeMount']) {
  Merak.lifeCycle.beforeMount = cb
}
export function beforeUnmount(cb: LifeCycle['beforeUnmount']) {
  Merak.lifeCycle.beforeUnmount = cb
}

export function afterUnmount(cb: LifeCycle['afterUnmount']) {
  Merak.lifeCycle.afterUnmount = cb
}

export function destroy(cb: LifeCycle['destroy']) {
  Merak.lifeCycle.destroy = cb
}

export function transformScript(cb: LifeCycle['transformScript']) {
  Merak.lifeCycle.transformScript = cb
}

export function tranformDocument(cb: LifeCycle['tranformDocument']) {
  Merak.lifeCycle.tranformDocument = cb
}
export function errorHandler(cb: LifeCycle['errorHandler']) {
  Merak.lifeCycle.errorHandler = cb
}
