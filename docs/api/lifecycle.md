## 生命周期

```ts
interface LifeCycle {
  beforeMount: () => any// 挂载前
  afterMount: () => any// 挂载后
  beforeUnmount: () => any// 卸载前
  afterUnmount: () => any// 卸载后
  destroy: () => any
  // 执行script前
  execScript: (scripts: HTMLScriptElement[]) => void
  // 挂载document前
  tranformDocument: (ele: HTMLElement) => void
  // 渲染结果挂载前
  prerender: (ele: HTMLElement) => void
}
```
