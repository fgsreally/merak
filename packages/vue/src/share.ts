/* eslint-disable @typescript-eslint/no-unused-vars */
import type { LoadDone, ProxyGlobals } from 'merak-core'
import type { PropType } from 'vue'

export const shareEmits = {

  // mount: (id: string) => true,
  // relunch: (id: string) => true,
  // hidden: (id: string) => true,
  // destroy: (id: string) => true,
  beforeMount: () => true,
  afterMount: () => true,
  beforeUnmount: () => true,
  afterUnmount: () => true,
  load: (params: LoadDone) => true,

  // 执行script前
  transformScript: (params: { originScripts: HTMLScriptElement[]; scripts: HTMLScriptElement[] }) => true,
  // 挂载document前
  tranformDocument: (params: { ele: HTMLElement }) => true,
  errorHandler: (params: { type: string; error: Error }) => true,
}

export const shareProps = {

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
    // required: true,
  },
  proxy: {
    type: Object as PropType<ProxyGlobals>,
  },
  keepAlive: {
    type: Boolean,
    default: false,
  },
  iframe: {
    type: String,
  },
}
