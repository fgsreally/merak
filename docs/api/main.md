## Merak 实例

```ts
declare class Merak {
  /** 实例ID */
  id: string;
  /** 项目URL */
  url: string;
  options: {
    /** 加载器，spa专用 */
    loader?: PureLoader;
    /** 沙箱 */
    proxy?: ProxyGlobals;
    /** 配置，默认配置在html中。但也可以单独维护一个json */
    configUrl?: string;
    /** iframe模式 */
    iframe?: string;
  };

  /** 所有子应用共享 */
  static namespace: Record<string, any>;
  get namespace(): Record<string, any>;

  /** css隔离容器 */
  shadowRoot: ShadowRoot;
  /** shadowroot 下的 document */
  sandDocument: HTMLElement | null;
  /** iframe 容器 */
  iframe: HTMLIFrameElement | null;
  /** window代理 */
  proxy: Window;
  /** 所有全局的代理 */
  proxyMap: ProxyGlobals;
  /** 子应用的html */
  template: string;
  /** 加载器，仅spa使用 */
  loader: PureLoader | undefined;
  /** 挂载数据 */
  props: any;
  /** 生命周期 */
  lifeCycle: LifeCycle;
  /** 子应用激活标志 */
  activeFlag: boolean;
  /** 子应用JS运行标志 */
  execFlag: boolean;
  /** 子应用mount标志 */
  mountFlag: boolean;
  /** 子应用cache标志 */
  cacheFlag: boolean;
  /** 子应用中的虚拟变量名 */
  fakeGlobalVar: string;
  /** 配置文件地址，配置内联时为空 */
  configUrl?: string;
  /** 隔离的全局变量 */
  globalVars: string[];
  /** 是否被预渲染 */
  isRender: boolean;

  constructor(
    id: string,
    url: string,
    options?: {
      loader?: PureLoader;
      proxy?: ProxyGlobals;
      configUrl?: string;
      iframe?: string;
    }
  );

  // 加载spa应用
  load(): Promise<any>;
  // 预渲染
  preRender(): void;
  // 下面部分谨慎使用
  // 激活沙箱
  active(): void;
  // 挂载
  mount(ele?: HTMLElement): void;
  // 卸载
  unmount(isKeepAlive: boolean): void;
  //销毁
  destroy(): void;
}
```

## web component

```html
<merak-app data-merak-id="实例ID" keep-alive />
<merak-ssr data-merak-id="实例ID" keep-alive />
<merak-block
  data-merak-id="实例ID"
  data-merak-var="分配的全局变量名"
  keep-alive
/>
```
