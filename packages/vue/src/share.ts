import type { ProxyGlobals } from 'merak-core'
import type { PropType } from 'vue'

export const shareEmits = {
  beforeMount: () => true,
  afterMount: () => true,
  beforeUnmount: () => true,
  afterUnmount: () => true,
  destroy: () => true,
  transformScript: (_: { originScripts: HTMLScriptElement[]; scripts: HTMLScriptElement[] }) => true,
  // 挂载document前
  tranformDocument: (_: HTMLElement) => true,
  // 渲染结果挂载前
  prerender: (_: HTMLElement) => true
  ,
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
