import { MERAK_DATA_ID, MERAK_EVENT_PREFIX, MERAK_KEEP_ALIVE, Merak, getInstance } from 'merak-core'
import type { PropType } from 'vue'
import { defineComponent, h, onUnmounted } from 'vue'
import { $window } from 'merak-helper'
import type { Loader } from 'merak-core/loader'
import { SSRLoader } from 'merak-core/loader'
import { shareEmits, shareProps } from './share'
export const vueSSRLoader = new SSRLoader()
export const MerakSSR = defineComponent({
  props: {
    ...shareProps,
    loader: {
      type: Object as PropType<Loader>,
      default: vueSSRLoader,
    },
  },
  emits: shareEmits,
  setup(props, { expose, emit }) {
    const { url, proxy, keepAlive, iframe, props: MerakProps, name, loader } = props
    const app = getInstance(name) || new Merak(name, url, { proxy, iframe, loader })
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
