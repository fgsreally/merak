import type { ProxyGlobals } from 'merak-core'
import type { PropType } from 'vue'

export const shareEmits = ['beforeMount', 'afterMount', 'beforeUnmount', 'afterUnmount', 'destroy', 'execScript', 'tranformDocument']

export const shareProps = {
  // fakeGlobalName & project id
  name: {
    type: String,
    required: true as const,
  },
  id: {
    type: String,

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
    default: true,
  },
  iframe: {
    type: String,
  },
}
