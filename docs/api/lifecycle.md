## 生命周期

```ts
interface LifeCycle {
  // 挂载前后
  beforeMount: (param: { instance: Merak }) => any
  afterMount: (param: { instance: Merak }) => any
  // 卸载前后

  beforeUnmount: (param: { instance: Merak }) => any
  afterUnmount: (param: { instance: Merak }) => any
  // 加载器加载后
  load: (
    param: LoadDone & {
      instance: Merak
    }
  ) => LoadDone | void
  // 手动卸载前

  deactive: (param: { instance: Merak }) => any
  // 插入script之前

  transformScript: (param: {
    originScripts: HTMLScriptElement[] // 所有script
    scripts: HTMLScriptElement[] // 未被忽略，即将插入的script
    instance: Merak
  }) => void
  // 插入shadowDom之前，此时可以操作子应用的dom
  tranformDocument: (param: { ele: HTMLElement; instance: Merak }) => void
}
```
