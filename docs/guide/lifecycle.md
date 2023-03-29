## 生命周期

```ts
interface LifeCycle {
  beforeMount: () => any
  afterMount: () => any
  beforeUnmount: () => any
  afterUnmount: () => anyw
  destroy: () => any
  // 执行script前
  execScript: (scripts: HTMLScriptElement[]) => void
  // 挂载document前
  tranformDocument: (ele: HTMLElement) => void
  // 渲染结果挂载前
  prerender: (ele: HTMLElement) => void
}
```

```ts
const app = new Merak(/** */)
app.lifeCycle.beforeMount = () => {}
```