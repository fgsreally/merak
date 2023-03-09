import type { Emitter, EventType } from 'mitt'
import type { CustomProxyHandler, LoadDone, MerakEvents, ProxyMap, lifecycle, lifecycles, merakEvent } from './types'
import type { PureLoader } from './loaders'
import { createProxy } from './proxy'
import { MERAK_DATA_ID, MERAK_EVENT_DESTROY, MERAK_EVENT_LOAD, MERAK_EVENT_UNMOUNT, MERAK_SHADE_STYLE } from './common'
import { eventTrigger, resolveUrl } from './utils'
import { MerakMap, bus, getBodyStyle } from './composable'

export class Merak {
  /** css隔离容器 */
  public shadowRoot: ShadowRoot
  /** shadowroot 下的 document */
  public sandDocument: HTMLElement | null

  /** iframe 容器 */
  public iframe: HTMLIFrameElement | null

  /** 事件总线 */
  public bus: Emitter<merakEvent> = bus

  /** window代理 */
  public proxy: Window

  /** 所有全局的代理 */
  public proxyMap = {} as unknown as ProxyMap

  /** 子应用的html */
  public template: string

  /** 加载器，仅spa使用 */
  public loader: PureLoader | undefined

  /** html中的script标签 */
  public templateScipts: any[]

  /** 挂载数据 */
  public props: any

  /** 生命周期 */
  public lifeCycles: lifecycles = {
    beforeLoad: [],
    beforeMount: [],
    afterMount: [],
    beforeUnmount: [],
    afterUnmount: [],
    activated: [],
    deactivated: [],
  }

  /** 子应用激活标志 */
  public activeFlag = false

  /** 子应用JS运行标志 */
  public execFlag = false

  /** 子应用mount标志 */
  public mountFlag = false

  /** 子应用cache标志 */
  public cacheFlag = false

  /** 子应用中的虚拟变量名 */
  public fakeGlobalName: string

  /** 配置文件地址，配置内联时为空 */
  public configUrl?: string

  /** 是否被预渲染 */
  public isRender = false

  /** 防止重复加载 */
  private loadPromise: Promise<any>

  /** 缓存事件，卸载时被释放 */
  private cacheEvent: Function[] = []

  constructor(public id: string, public url: string, public options: {
    loader?: PureLoader
    customHandler?: CustomProxyHandler
    configUrl?: string
    iframe?: boolean
  } = {},
  ) {
    MerakMap.set(id, this)

    const { customHandler = (param: any) => param, configUrl, loader } = options
    this.configUrl = configUrl
    this.loader = loader
    const globals = createProxy(id, url, customHandler)

    for (const i in globals)
      this.proxyMap[i] = new Proxy({} as any, globals[i])

    this.proxy = this.proxyMap.window
  }

  onMounted(cb: lifecycle) {
    this.lifeCycles.afterMount.push(cb)
  }

  on(type: Parameters<Emitter<MerakEvents>['on']>[0], param: Parameters<Emitter<MerakEvents>['on']>[1]) {
    bus.on(type, param)
    this.cacheEvent.push(() => {
      bus.off(type, param)
    })
  }

  emit(type: EventType, event: unknown) {
    this.bus.emit(type, event)
  }

  onBeforeMounted(cb: lifecycle) {
    this.lifeCycles.beforeMount.push(cb)
  }

  onActivated(cb: lifecycle) {
    this.lifeCycles.activated.push(cb)
  }

  onBeforeUnmount(cb: lifecycle) {
    this.lifeCycles.beforeUnmount.push(cb)
  }

  execHook(stage: keyof lifecycles) {
    for (const cb of this.lifeCycles[stage])
      cb(this)
  }

  active(fakeGlobalName: string) {
    if (!this.activeFlag) {
      this.fakeGlobalName = fakeGlobalName
      window[fakeGlobalName] = this.proxy
      this.activeFlag = true
    }
  }

  async load() {
    if (this.loadPromise)
      return this.loadPromise
    const { id, url, configUrl } = this
    return this.loadPromise = (this.loader!.load(id, url, configUrl) as Promise<LoadDone>).then((loadRes) => {
      eventTrigger(window, MERAK_EVENT_LOAD, { id, loadRes })
      const { template, scripts, fakeGlobalName } = loadRes
      this.template = template
      this.templateScipts = scripts
      this.active(fakeGlobalName)
    })
  }

  preRender() {
    const proxyEle = document.createElement('merak-app')
    proxyEle.setAttribute(MERAK_DATA_ID, this.id)
    proxyEle.setAttribute('style', 'display:none')
    document.body.appendChild(proxyEle)
    this.isRender = true
  }

  initIframe() {
    this.iframe!.contentWindow![this.fakeGlobalName] = this.proxy
  }

  private mountTemplateAndScript(ele?: ParentNode) {
    this.execHook('beforeMount')

    if (!this.cacheFlag) {
      this.sandDocument = document.importNode(window.document.implementation.createHTMLDocument('').documentElement, true)

      // work for spa
      if (this.loader) {
        // template
        this.sandDocument.innerHTML = this.template

        // script
        if (!this.execFlag) {
          (this.iframe?.contentDocument || this.sandDocument).querySelector('body')?.append(...this.templateScipts.map((scripts) => {
            const scriptTag = document.createElement('script')
            for (const i in scripts)
              scriptTag[i] = scripts[i]

            return scriptTag
          }))
          this.execFlag = true
        }
      }
      // work for ssr
      if (ele) {
        const scriptEle = [...ele.querySelectorAll('script')].filter((item) => {
          item.parentNode?.removeChild(item)
          if (this.execFlag)
            return false
          const src = item.getAttribute('src')
          if (src)
            item.src = resolveUrl(src, this.url)

          if (item.hasAttribute('merak-ignore'))
            return false

          return true
        })
        this.sandDocument.querySelector('body')?.appendChild(ele)
        // script when use iframe
        if (scriptEle.length > 0) {
          if (this.iframe)
            this.iframe.contentDocument!.querySelector('body')!.append(...scriptEle)
          else this.sandDocument.querySelector('body')?.append(...scriptEle)

          this.execFlag = true
        }
        // template
        // this.sandDocument.append(ele)
      }
      const shade = document.createElement('div')
      shade.setAttribute('style', MERAK_SHADE_STYLE)
      this.sandDocument.insertBefore(shade, this.sandDocument.firstChild)
      const body = this.sandDocument.querySelector('body')!
      body.setAttribute('style', getBodyStyle())
      body.classList.add(`merak-${this.id}-body`)
    }
    this.shadowRoot.appendChild(this.sandDocument!)
    this.mountFlag = true
    this.execHook('afterMount')
  }

  mount(ele?: HTMLElement) {
    if (this.options.iframe && !this.iframe) {
      this.iframe = document.createElement('iframe') as HTMLIFrameElement
      this.iframe.onload = () => this.mountTemplateAndScript(ele)
      document.body.appendChild(this.iframe)
    }
    else {
      this.mountTemplateAndScript(ele)
    }
  }

  unmount(isKeepAlive: boolean) {
    this.cacheFlag = isKeepAlive

    this.execHook('beforeUnmount')
    eventTrigger(window, MERAK_EVENT_UNMOUNT + this.id)
    this.execHook('afterUnmount')
    this.mountFlag = false

    if (!isKeepAlive)

      this.destroy()
  }

  destroy() {
    eventTrigger(window, MERAK_EVENT_DESTROY + this.id)
    this.execHook('deactivated')

    delete window[this.fakeGlobalName]
    this.activeFlag = false
    if (this.iframe)
      this.execFlag = false
    // MerakMap.delete(this.id)
    this.sandDocument = null
    if (this.iframe)
      this.iframe = null
    while (this.cacheEvent.length > 0)
      this.cacheEvent.pop()!()
  }
}

// for worker loader
// export function createWorkerApp(app: Merak, worker: Worker, configUrl?: string) {
//   app.load = () => {
//     return new Promise((resolve, reject) => {
//       worker.postMessage({ cmd: 'load', id: app.id, url: app.url, configUrl })
//       function message(e: MessageEvent) {
//         const { cmd, msg, type } = e.data

//         if (cmd === 'load') {
//           app.active(e.data)
//           resolve(app.id)
//           worker.removeEventListener('message', message)
//         }
//         if (cmd === 'error' && type === 'load') {
//           reject(msg)
//           worker.removeEventListener('message', message)
//         }
//       }
//       worker.addEventListener('message', message)
//     })
//   }

//   app.preload = (filePath) => {
//     worker.postMessage({ cmd: 'preload', id: app.id, filePath })
//     return new Promise((resolve, reject) => {
//       function message(e: MessageEvent) {
//         const { cmd, id, msg, type, url } = e.data
//         if (id !== app.id)
//           return
//         if (cmd === 'preload') {
//           resolve(url)
//           worker.removeEventListener('message', message)
//         }
//         if (cmd === 'error' && type === 'preload') {
//           reject(msg)
//           worker.removeEventListener('message', message)
//         }
//       }
//       worker.addEventListener('message', message)
//     })
//   }
// }
