import type { Emitter, EventType } from 'mitt'
import type { LoadDone, MerakEvents, ProxyGlobals, merakEvent } from './types'
import type { PureLoader } from './loaders'
import { createProxy } from './proxy'
import { MERAK_DATA_ID, MERAK_EVENT_DESTROY, MERAK_EVENT_EXEC_SCRIPT, MERAK_EVENT_HIDDEN, MERAK_EVENT_MOUNT, MERAK_EVENT_RELUNCH, MERAK_SHADE_STYLE } from './common'
import { eventTrigger, resolveUrl } from './utils'
import { MerakMap, bus, getBodyStyle } from './composable'
import { LifeCycle } from './lifecycle'

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
  public proxyMap = {} as unknown as ProxyGlobals

  /** 子应用的html */
  public template: string

  /** 加载器，仅spa使用 */
  public loader: PureLoader | undefined

  /** html中的script标签 */
  public templateScipts: any[]

  /** 挂载数据 */
  public props: any

  /** 生命周期 */
  public lifeCycle = new LifeCycle()
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
    proxy?: ProxyGlobals
    configUrl?: string
    iframe?: boolean
  } = {},
  ) {
    if (MerakMap.has(id))
      return MerakMap.get(id) as Merak
    MerakMap.set(id, this)

    const { proxy = createProxy(id, url), configUrl, loader } = options
    this.configUrl = configUrl
    this.loader = loader

    for (const i in proxy)
      this.proxyMap[i] = new Proxy({} as any, proxy[i])

    this.proxy = this.proxyMap.window as any
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

  execHook<Stage extends keyof LifeCycle>(stage: Stage, params?: Parameters<LifeCycle[Stage]>[0]) {
    // @ts-expect-error work for lifecycle
    this.lifeCycle[stage]?.(params)
  }

  setGlobalName(fakeGlobalName: string) {
    this.fakeGlobalName = fakeGlobalName
  }

  active() {
    if (!this.activeFlag) {
      if (DEV && !this.fakeGlobalName)
        throw new Error('miss fakeGlobalName')
      if (this.iframe)
        (this.iframe.contentWindow as Window)[this.fakeGlobalName] = this.proxy

      else window[this.fakeGlobalName] = this.proxy
      this.activeFlag = true
    }
  }

  async load() {
    if (this.loadPromise)
      return this.loadPromise
    const { id, url, configUrl } = this
    return this.loadPromise = (this.loader!.load(id, url, configUrl) as Promise<LoadDone>).then((loadRes) => {
      const { template, scripts, fakeGlobalName } = loadRes
      this.template = template
      this.templateScipts = scripts
      this.setGlobalName(fakeGlobalName)
    })
  }

  preRender() {
    const proxyEle = document.createElement('merak-app')
    proxyEle.setAttribute(MERAK_DATA_ID, this.id)
    proxyEle.setAttribute('style', 'display:none')
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
          const scripts = this.templateScipts.map((scripts) => {
            const scriptTag = document.createElement('script')
            for (const i in scripts)
              scriptTag[i] = scripts[i]

            return scriptTag
          })
          this.execHook('execScript', scripts);
          (this.iframe?.contentDocument || this.sandDocument).querySelector('body')?.append(...scripts)

          this.execFlag = true
        }
        else {
          eventTrigger(window, MERAK_EVENT_RELUNCH + this.id)
        }
      }
      // work for ssr
      if (ele) {
        // mount script on body or iframe

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
        if (!this.execFlag) {
          this.execHook('execScript', scriptEle)

          if (this.iframe)
            this.iframe.contentDocument!.querySelector('body')!.append(...scriptEle)
          else this.sandDocument.querySelector('body')?.append(...scriptEle)

          this.execFlag = true
        }
        else {
          eventTrigger(window, MERAK_EVENT_RELUNCH + this.id)
        }

        // template
        // this.sandDocument.append(ele)
      }
      const shade = document.createElement('div')
      shade.setAttribute('style', MERAK_SHADE_STYLE)
      this.sandDocument.insertBefore(shade, this.sandDocument.firstChild)
      const body = this.sandDocument.querySelector('body')!
      body.setAttribute('style', getBodyStyle())
      body.classList.add('merak-body', this.id)
    }

    this.execHook('tranformDocument', this.sandDocument!)
    this.shadowRoot.appendChild(this.sandDocument!)
    this.mountFlag = true

    eventTrigger(window, MERAK_EVENT_MOUNT + this.id)
    this.execHook('afterMount')
  }

  mount(ele?: HTMLElement) {
    if (this.options.iframe && !this.iframe) {
      this.iframe = document.createElement('iframe') as HTMLIFrameElement
      this.iframe.style.display = 'none'
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
    delete window[this.fakeGlobalName]
    this.activeFlag = false
    if (this.iframe) {
      this.iframe.remove()
      this.execFlag = false
    }
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
