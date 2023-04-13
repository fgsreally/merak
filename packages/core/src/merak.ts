import { iframeInstance } from './iframe'
import type { LoadDone, ProxyGlobals } from './types'
import type { PureLoader } from './loaders'
import { createProxy } from './proxy'
import { MERAK_DATA_ID, MERAK_EVENT_DESTROY, MERAK_EVENT_HIDDEN, MERAK_EVENT_MOUNT, MERAK_EVENT_RELUNCH, MERAK_SHADE_STYLE } from './common'
import { eventTrigger, scriptPrimise } from './utils'
import { MerakMap, getBodyStyle } from './helper'
import { LifeCycle } from './lifecycle'
import { cloneScript } from './compile'

export class Merak {
  /** 所有子应用共享 */
  static namespace: Record<string, any> = {}

  /** css隔离容器 */

  public shadowRoot: ShadowRoot
  /** shadowroot 下的 document */

  public sandDocument: HTMLElement | null
  /** iframe 容器 */

  public iframe: HTMLIFrameElement | null
  /** window代理 */
  public proxy: Window

  /** 所有全局的代理 */
  public proxyMap = {} as unknown as ProxyGlobals

  /** 子应用的html */
  public template: string

  /** 加载器，仅spa使用 */
  public loader: PureLoader | undefined

  /** 挂载数据 */
  public props: any

  /** 生命周期 */
  public lifeCycle = new LifeCycle()

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
  public configUrl?: string

  /** 隔离的全局变量 */
  public globalVars: string[]

  /** 是否被预渲染 */
  public isRender = false

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

  protected execHook<Stage extends keyof LifeCycle>(stage: Stage, params?: Parameters<LifeCycle[Stage]>[0]) {
    return this.lifeCycle[stage]?.(params)
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
      if (__DEV__ && !this.fakeGlobalVar)
        throw new Error(`miss fakeGlobalVar in "${this.id}"`)
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
    return this.loadPromise = (this.loader!.load(id, url, configUrl) as Promise<LoadDone>).then((loadRes) => {
      const { template, fakeGlobalVar, globals, cmd } = loadRes
      // @ts-expect-error load error
      if (cmd === 'error') {
        this.execHook('errorHandler', (loadRes as any).e)
      }

      else {
        this.template = template
        this.globalVars = globals
        this.setGlobalVar(fakeGlobalVar)
      }
    })
  }

  /**
 * @experiment
 */
  preRender() {
    const proxyEle = document.createElement('merak-app')
    proxyEle.setAttribute(MERAK_DATA_ID, this.id)
    proxyEle.setAttribute('style', 'display:none')
    this.execHook('prerender', proxyEle)
    document.body.appendChild(proxyEle)

    this.isRender = true
  }

  private mountTemplateAndScript(ele?: ParentNode) {
    this.execHook('beforeMount')
    this.active()

    if (!this.cacheFlag) {
      this.sandDocument = document.importNode(window.document.implementation.createHTMLDocument('').documentElement, true)
      // work for spa
      if (this.loader) {
        // template
        this.sandDocument.innerHTML = this.template
        // mount script on body or iframe
        if (!this.execFlag) {
          const originScripts = Array.from(this.sandDocument.querySelectorAll('script'))
          const scripts = originScripts.filter((script) => {
            script.remove()
            return !script.hasAttribute('merak-ignore') && script.type !== 'importmap'
          }).map(script => cloneScript(script, this.fakeGlobalVar, this.globalVars))

          this.execHook('execScript', { originScripts, scripts });
          // TODO JS queue
          (this.iframe?.contentDocument || this.sandDocument).querySelector('body')?.append(...scripts)
          // only invoke mount event after all scripts load/fail
          Promise.all(scripts.map(scriptPrimise)).catch((e) => {
            return this.execHook('errorHandler', e as any)
          }).finally(() => {
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
        const scripts = originScripts.filter((item) => {
          item.remove()
          if (this.execFlag)
            return false

          return !item.hasAttribute('merak-ignore') && item.type !== 'importmap'
        })
        this.sandDocument.querySelector('body')?.appendChild(ele)

        if (!this.execFlag) {
          this.execHook('execScript', { originScripts, scripts });

          (this.iframe ? this.iframe.contentDocument : this.sandDocument)!.querySelector('body')!.append(...scripts)
          Promise.all(scripts.map(scriptPrimise)).catch((e) => {
            return this.execHook('errorHandler', e as any)
          }).finally(() => {
            this.execFlag = true
            eventTrigger(window, MERAK_EVENT_MOUNT + this.id)
          })
        }
        else {
          eventTrigger(window, MERAK_EVENT_RELUNCH + this.id)
        }
      }
      if (this.mountIndex === 0) {
        const shade = document.createElement('div')
        shade.setAttribute('style', MERAK_SHADE_STYLE)
        this.sandDocument.insertBefore(shade, this.sandDocument.firstChild)
        const body = this.sandDocument.querySelector('body')!
        body.setAttribute('style', getBodyStyle())
      }
    }

    this.execHook('tranformDocument', this.sandDocument!)
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
