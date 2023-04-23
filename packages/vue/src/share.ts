import type { ProxyGlobals } from 'merak-core'
import type { PropType } from 'vue'

export const shareEmits = {

  mount: (_id?: string) => true,
  relunch: (_id?: string) => true,
  hidden: (_id?: string) => true,
  destroy: (_id?: string) => true,

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
