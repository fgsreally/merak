import { MERAK_DATA_ID, MERAK_KEEP_ALIVE, Merak } from 'merak-core'
import { PureLoader } from 'merak-core/loader'
import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { shareEmits, shareProps } from './share'

export const vueLoader = new PureLoader()
export const MerakApp = defineComponent({
  props: {
    ...shareProps,
    configUrl: String,

    loader: {
      type: Object as PropType<PureLoader>,
      default: vueLoader,
    },

  },
  emits: shareEmits,
  setup(props, { expose, emit }) {
    const { name, url, proxy, loader, configUrl, keepAlive, props: MerakProps, iframe, id } = props
    const app = new Merak(id || name, url, { loader, configUrl, proxy, iframe })
    app.props = MerakProps

    for (const ev of shareEmits)
      app.lifeCycle[ev] = (arg: any) => emit(ev, arg)

    expose({ app })
    return () => h('merak-app', { [MERAK_DATA_ID]: id || name, [MERAK_KEEP_ALIVE]: keepAlive })
  },
})
