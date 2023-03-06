import type { CustomProxyHandler } from 'merak-core'
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
    customHandler: {
      type: Function as PropType<CustomProxyHandler>,
    },

  },
  setup(props, { expose }) {
    const { name, url, customHandler, isKeep } = props
    const app = new Merak(name, url, { customHandler })
    expose({ app })
    return () => h('merak-ssr', { [MERAK_DATA_ID]: props.name, [MERAK_KEEP_ALIVE]: isKeep })
  },
})
