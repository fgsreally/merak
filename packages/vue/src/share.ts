/* eslint-disable @typescript-eslint/no-unused-vars */
import type { LoadDone, Merak, ProxyGlobals } from 'merak-core'
import type { PropType } from 'vue'

export const shareEmits = {

  beforeMount: (param: { instance: Merak }) => true,
  afterMount: (param: { instance: Merak }) => true,
  beforeUnmount: (param: { instance: Merak }) => true,
  afterUnmount: (param: { instance: Merak }) => true,
  load: (param: LoadDone & { instance: Merak }) => true,

  // 执行script前
  transformScript: (param: { originScripts: HTMLScriptElement[]; scripts: HTMLScriptElement[]; instance: Merak }) => true,
  // 挂载document前
  tranformDocument: (param: { ele: HTMLElement; instance: Merak }) => true,
  deactive: (param: LoadDone & { instance: Merak }) => true,
}

export const shareProps = {
  inlineStyle: {
    type: Boolean, default: true,
  },
  name: {
    type: String,
    required: true as const,
  },
  url: {
    type: String,
    required: true as const,
  },
  props: {
    type: Object as PropType<any>,

  },
  proxy: {
    type: Object as PropType<ProxyGlobals>,
  },
  flag: {
    type: String,
    default: 'destroy',
  },
  iframe: {
    type: String,
  },
  timeout: {
    type: Number,
  },
}
