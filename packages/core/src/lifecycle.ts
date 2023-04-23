import type { LoadDone } from './types'
import type { Merak } from './merak'
export class LifeCycle {
  beforeMount: (params: { instance: Merak }) => any
  afterMount: (params: { instance: Merak }) => any
  beforeUnmount: (params: { instance: Merak }) => any
  afterUnmount: (params: { instance: Merak }) => any
  load: (params: { instance: Merak } & LoadDone) => LoadDone | void
  destroy: () => any
  // 执行script前
  transformScript: (params: { instance: Merak; originScripts: HTMLScriptElement[]; scripts: HTMLScriptElement[] }) => void
  // 挂载document前
  tranformDocument: (params: { instance: Merak; ele: HTMLElement }) => void

  // 错误处理
  errorHandler: (params: { type: 'scriptError' | 'loadError'; error: Error; instance: Merak }) => any = ({ error, instance, type }) => {
    console.error(`[merak:${instance.id}] ${type}:${error.message}`)
    console.error(error)
  }
}
