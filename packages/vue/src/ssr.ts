import { MERAK_DATA_ID, MERAK_KEEP_ALIVE, Merak, getInstance } from 'merak-core'
import { defineComponent, h } from 'vue'
import { shareEmits, shareProps } from './share'

export const MerakSSR = defineComponent({
  props: {
    ...shareProps,
  },
  emits: shareEmits,
  setup(props, { expose, emit }) {
    const { url, proxy, keepAlive, iframe, props: MerakProps, id } = props
    const app = getInstance(id) || new Merak(id, url, { proxy, iframe })
    app.props = MerakProps
    for (const ev of shareEmits)
      app.lifeCycle[ev] = (arg: any) => emit(ev, arg)
    expose({ app })
    return () => h('merak-ssr', { [MERAK_DATA_ID]: id, [MERAK_KEEP_ALIVE]: keepAlive })
  },
})
