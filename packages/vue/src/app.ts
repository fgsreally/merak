import type { MerakConfig } from 'merak-core'
import { MERAK_DATA_ID, MERAK_KEEP_ALIVE, Merak, getInstance } from 'merak-core'
import type { Loader } from 'merak-core/loader'
import { PureLoader } from 'merak-core/loader'
import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { shareEmits, shareProps } from './share'
export const vueLoader = new PureLoader()
export const MerakApp = defineComponent({
  props: {
    ...shareProps,
    configOrUrl: {
      type: Object as PropType<string | MerakConfig>,
    },

    loader: {
      type: Object as PropType<Loader>,
      default: vueLoader,
    },

  },
  emits: shareEmits,
  setup(props, { expose, emit }) {
    const { url, proxy, loader, configOrUrl, keepAlive, props: MerakProps, iframe, name } = props
    const app = getInstance(name) || new Merak(name, url, { loader, configOrUrl, proxy, iframe })
    app.props = MerakProps
    for (const ev in shareEmits) {
      if (ev === 'errorHandler')
        app[ev] = (arg: any) => emit(ev as any, arg)
      else
        app.lifeCycle[ev] = (arg: any) => emit(ev as any, arg)
    }

    expose({ app })
    return () => h('merak-app', { [MERAK_DATA_ID]: name, [MERAK_KEEP_ALIVE]: keepAlive })
  },
})
