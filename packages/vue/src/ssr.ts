import { MERAK_DATA_ID, MERAK_KEEP_ALIVE, Merak, getInstance } from 'merak-core'
import { defineComponent, h } from 'vue'
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
    for (const ev in shareEmits)
      app.lifeCycle[ev] = (arg: any) => emit(ev as any, arg)
    expose({ app })
    return () => h('merak-ssr', { [MERAK_DATA_ID]: name, [MERAK_KEEP_ALIVE]: keepAlive })
  },
})
