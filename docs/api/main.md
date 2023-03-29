## Merak 实例
```ts
declare class Merak {
  /** 项目ID */
  id: string
  /** 项目URL */
  url: string
  options: {
    /** 加载器，spa专用 */
    loader?: PureLoader
    /** 沙箱 */
    proxy?: ProxyGlobals
    /** 配置，默认配置在html中。但也可以单独维护一个json */
    configUrl?: string
    /** iframe模式 */
    iframe?: string
  }

  /** 所有子应用共享 */
  static namespace: Record<string, any>
  /** css隔离容器 */
  shadowRoot: ShadowRoot
  /** shadowroot 下的 document */
  sandDocument: HTMLElement | null
  /** iframe 容器 */
  iframe: HTMLIFrameElement | null
  /** window代理 */
  proxy: Window
  /** 所有全局变量的代理 */
  proxyMap: ProxyGlobals
  /** 子应用的html */
  template: string
  /** 加载器，仅spa使用 */
  loader: PureLoader | undefined
  /** html中的script标签 */
  templateScipts: any[]
  /** 挂载数据 */
  props: any
  /** 生命周期 */
  lifeCycle: LifeCycle
  /** 子应用激活标志 */
  activeFlag: boolean
  /** 子应用JS运行标志 */
  execFlag: boolean
  /** 子应用mount标志 */
  mountFlag: boolean
  /** 子应用cache标志 */
  cacheFlag: boolean
  /** 子应用中的虚拟变量名 */
  fakeGlobalVar: string
  /** 配置文件地址，配置内联时为空 */
  configUrl?: string
  /** 是否被预渲染 */
  isRender: boolean

}
```

## web component

```html
<merak-app  
data-merak-id='id' 
keep-alive/>
<merak-ssr  
data-merak-id='id' 
keep-alive/>
<merak-block  
data-merak-id='id' 
data-merak-var='fakeGlobalName'
keep-alive/>
```

