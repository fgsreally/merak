import { MERAK_DATA_ID, MERAK_EVENT_PREFIX, MERAK_KEEP_ALIVE, Merak, getInstance } from 'merak-core'
import { defineComponent, h, onUnmounted } from 'vue'
import { $window } from 'merak-helper'
import { shareEmits, shareProps } from './share'

export const MerakSSR = defineComponent({
  props: {
    ...shareProps,
  },
  emits: shareEmits,
  setup(props, { expose, emit }) {
    const { url, proxy, keepAlive, iframe, props: MerakProps, name } = props
    const app = getInstance(name) || new Merak(name, url, { proxy, iframe })
    app.props = MerakProps
    for (const ev in shareEmits) {
      const eventName = MERAK_EVENT_PREFIX + ev + name
      const handler = () => emit(ev as any, name)
      const window = $window()
      window.addEventListener(eventName, handler)
      onUnmounted(() => window.removeEventListener(eventName, handler))
    }
    expose({ app })
    return () => h('merak-ssr', { [MERAK_DATA_ID]: name, [MERAK_KEEP_ALIVE]: keepAlive })
  },
})
