## 生命周期

```ts
interface LifeCycle {
  beforeMount: () => any
  afterMount: () => any
  beforeUnmount: () => any
  afterUnmount: () => any
  destroy: () => any
  // 执行script前
  execScript: (params: { originScripts: HTMLScriptElement[]; scripts: HTMLScriptElement[] }) => void
  // 挂载document前
  tranformDocument: (ele: HTMLElement) => void
 
}
```
添加生命周期：
```ts
const app = new Merak(/** */)
app.lifeCycle.beforeMount = () => {}
```