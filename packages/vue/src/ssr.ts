import type { ProxyGlobals } from 'merak-core'
import { MERAK_DATA_ID, MERAK_KEEP_ALIVE, Merak } from 'merak-core'
import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'

export const MerakSSR = defineComponent({
  props: {
    // just project id
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    isKeep: {
      type: Boolean,
      default: true,
    },
    proxy: {
      type: Object as PropType<ProxyGlobals>,

    },

  },
  setup(props, { expose }) {
    const { name, url, proxy, isKeep } = props
    const app = new Merak(name, url, { proxy })
    expose({ app })
    return () => h('merak-ssr', { [MERAK_DATA_ID]: props.name, [MERAK_KEEP_ALIVE]: isKeep })
  },
})
