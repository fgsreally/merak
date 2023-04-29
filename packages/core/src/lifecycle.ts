import type { LoadDone } from './types'
export class LifeCycle {
  beforeMount: () => any
  afterMount: () => any
  beforeUnmount: () => any
  afterUnmount: () => any
  load: (params: LoadDone) => LoadDone | void
  destroy: () => any
  // 执行script前
  transformScript: (params: { originScripts: HTMLScriptElement[]; scripts: HTMLScriptElement[] }) => void
  // 挂载document前
  tranformDocument: (params: { ele: HTMLElement }) => void
}
