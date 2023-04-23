import { MERAK_DATA_ID, MERAK_EVENT_PREFIX, MERAK_KEEP_ALIVE, Merak, getInstance } from 'merak-core'
import { PureLoader } from 'merak-core/loader'
import type { PropType } from 'vue'
import { defineComponent, h, onUnmounted } from 'vue'
import { $window } from 'merak-helper'
import { shareEmits, shareProps } from './share'
export const vueLoader = new PureLoader()
export const MerakApp = defineComponent({
  props: {
    ...shareProps,
    configUrl: String,

    loader: {
      type: Object as PropType< PureLoader>,
      default: vueLoader,
    },

  },
  emits: shareEmits,
  setup(props, { expose, emit }) {
    const { url, proxy, loader, configUrl, keepAlive, props: MerakProps, iframe, name } = props
    const app = getInstance(name) || new Merak(name, url, { loader, configUrl, proxy, iframe })
    app.props = MerakProps
    for (const ev in shareEmits) {
      const eventName = MERAK_EVENT_PREFIX + ev + name
      const handler = () => emit(ev as any, name)
      const window = $window()
      window.addEventListener(eventName, handler)
      onUnmounted(() => window.removeEventListener(eventName, handler))
    }
    expose({ app })
    return () => h('merak-app', { [MERAK_DATA_ID]: name, [MERAK_KEEP_ALIVE]: keepAlive })
  },
})
