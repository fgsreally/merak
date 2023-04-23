/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ProxyGlobals } from 'merak-core'
import type { PropType } from 'vue'

export const shareEmits = {

  mount: (id: string) => true,
  relunch: (id: string) => true,
  hidden: (id: string) => true,
  destroy: (id: string) => true,

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
