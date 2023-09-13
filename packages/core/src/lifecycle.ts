import type { LoadDone } from './types'
import type { Merak } from './merak'
export class LifeCycle {
  beforeMount: (param: { instance: Merak }) => any
  afterMount: (param: { instance: Merak }) => any
  beforeUnmount: (param: { instance: Merak }) => any
  afterUnmount: (param: { instance: Merak }) => any
  load: (param: LoadDone & { instance: Merak }) => LoadDone | void
  deactive: (param: { instance: Merak }) => any
  // 执行script前
  transformScript: (param: { originScripts: HTMLScriptElement[]; scripts: HTMLScriptElement[];instance: Merak }) => void
  // 挂载document前
  tranformDocument: (param: { ele: HTMLElement; instance: Merak }) => void
}
