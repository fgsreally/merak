export class LifeCycle {
  beforeMount: () => any
  afterMount: () => any
  beforeUnmount: () => any
  afterUnmount: () => any
  destroy: () => any
  // 执行script前
  execScript: (params: { originScripts: HTMLScriptElement[]; scripts: HTMLScriptElement[] }) => void
  // 挂载document前
  tranformDocument: (ele: HTMLElement) => void
  // 渲染结果挂载前
  prerender: (ele: HTMLElement) => void
  // 错误处理

  errorHandler: (err: any) => any = (e: any) => console.error(e)
}
