import { MERAK_DATA_ID, MERAK_KEEP_ALIVE, Merak, getInstance } from 'merak-core'
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
    const { url, proxy, loader, configUrl, keepAlive, props: MerakProps, iframe, id } = props
    const app = getInstance(id) || new Merak(id, url, { loader, configUrl, proxy, iframe })
    app.props = MerakProps

    for (const ev in shareEmits)
      app.lifeCycle[ev] = (arg: any) => emit(ev as any, arg)
    expose({ app })
    return () => h('merak-app', { [MERAK_DATA_ID]: id, [MERAK_KEEP_ALIVE]: keepAlive })
  },
})
