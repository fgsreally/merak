import type { ProxyGlobals } from 'merak-core'
import { MERAK_DATA_ID, MERAK_KEEP_ALIVE, Merak } from 'merak-core'
import { PureLoader } from 'merak-core/loader'
import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'

export const vueLoader = new PureLoader()
export const MerakApp = defineComponent({
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
    configUrl: String,
    keepAlive: {
      type: Boolean,
      default: true,
    },

    loader: {
      type: Object as PropType<PureLoader>,
      default: vueLoader,
    },
    proxy: {
      type: Object as PropType<ProxyGlobals>,
    },
    props: {
      type: Object as PropType<any>,
    },
  },
  setup(props, { expose }) {
    const { name, url, proxy, loader, configUrl, keepAlive, props: MerakProps } = props
    const app = new Merak(name, url, { loader, configUrl, proxy })
    app.props = MerakProps
    expose({ app })
    return () => h('merak-app', { [MERAK_DATA_ID]: props.name, [MERAK_KEEP_ALIVE]: keepAlive })
  },
})
