# 主应用api
## jsapi 
```ts
const instance = new Merak(name, url, {
  loader, // 加载器
  proxy, // 沙箱
  loaderOptions, // 传给loader的值
  iframe, // iframeid
  timeout, // 过期时间，详见实例
})
// 预加载，参数为assets/script+上面的参数
// assets意味着不挂载script，script相反
declare function preload(type: 'script' | 'assets', ...args: ConstructorParameters<typeof Merak>): Merak<Loader>
// 设置公共错误处理
declare function setErrorHandler(cb: (arg: {
  type: 'missInstance' | 'missProperty' | 'loadError' | 'hasMount' | 'scriptError' | string
  error: Error
  instance?: Merak
}) => void): void
// 获得实例
declare function getInstance(id: string): Merak<Loader> | undefined
declare function getHost(id: string): Element | undefined
declare function getUrl(id: string): string
// 获得namespace
declare function $$namespace(): (typeof Merak)['namespace']
declare function $$namespace<K extends keyof (typeof Merak)['namespace']>(key: string): (typeof Merak)['namespace'][K]
```
其他的详见源码
### Merak 实例

```ts
declare class Merak<L extends Loader = Loader> {
  /** 分配的名字，等于data-merak-id */ id: string
  /** 源url */ url: string
  options: {
    loader?: L
    proxy?: ProxyGlobals
    loaderOptions?: any
    iframe?: string
    timeout?: number
  }

  /** 所有子应用共享 */
  static namespace: NameSpace
  /** 已经被占用的变量名 */
  static fakeGlobalVars: Set<string>
  /** 生命周期 */
  lifeCycle: LifeCycle
  /** work for preload */
  el: HTMLElement | null
  /** css隔离容器 */
  shadowRoot: ShadowRoot | null
  /** shadowroot 下的 document */
  sandHtml: HTMLHtmlElement | null
  /** iframe 容器 */
  iframe: HTMLIFrameElement | null
  /** window代理 */
  proxy: Window
  /** 性能管理器 */
  perf: Perf
  /** 所有全局的代理 */
  proxyMap: ProxyGlobals
  /** 子应用的html */
  template: string
  /** 加载器，负责加载html */
  loader: L | undefined
  /** 挂载数据 */
  props: Props
  /** 子应用激活标志 */
  activeFlag: boolean
  /** 子应用挂载次数 */
  mountIndex: number
  /** 子应用JS运行标志 */
  execPromise: Promise<void> | boolean
  /** 子应用mount标志 */
  mountFlag: boolean
  /** 子应用cache标志 */
  cacheFlag: boolean
  /** 子应用中的虚拟变量名 */
  fakeGlobalVar: string
  /** 传给loader的options */
  loaderOptions?: any
  /** 隔离的原生全局变量 */
  nativeVars: string[]
  /** 隔离的自定义全局变量 */
  customVars: string[]
  /** 快速切换页面时，当卸载->挂载时间小于这个数，不会触发子应用钩子.timeout为0时，则不走定时器，直接调用 */
  timeout: number
  protected timer: NodeJS.Timeout | null
  /** 防止重复加载 */
  protected loadPromise: Promise<any>
  /** 子应用的 base */
  baseUrl: string
  /**
     * 是否处于预加载状态
     * 'assets' 为预加载了资源
     * 'script' 为预执行了script，但不触发钩子
    */
  preloadStat: false | 'assets' | 'script'
  /** 缓存事件，卸载时被释放 */
  sideEffects: (() => void)[]
  constructor(
    id: string,
    url: string, options?: {
      loader?: L
      proxy?: ProxyGlobals
      loaderOptions?: any
      iframe?: string
      timeout?: number
    })
  static errorHandler({ type, error }: {
    type: string
    error: Error
    instance?: Merak
  }): void
  errorHandler({ type, error }: {
    type: string
    error: Error
  }): void
  get namespace(): NameSpace
  protected execCycle<Stage extends keyof LifeCycle>(stage: Stage, param?: Omit<Parameters<LifeCycle[Stage]>[0], 'instance'>): any
  protected cleanSideEffect(): void
  protected eventTrigger(el: HTMLElement | Window | Document, eventName: string, detail?: string): void
  setGlobalVars(fakeGlobalVar: string, nativeVars: string[], customVars: string[]): void
  active(): void
  load(): Promise<any>
  private mountTemplateAndScript
  mount(): void
  unmount(flag: string): void
  deactive(): void
  destroy(): void
}
```
## web component

```html
<merak-app data-merak-id="分配一个名字" />

```
