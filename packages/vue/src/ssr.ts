import { $$jump, MERAK_DATA_ID, MERAK_KEEP_ALIVE, Merak, SSRLoader, getInstance } from 'merak-core'
import type { PropType } from 'vue'
import { defineComponent, h, watch } from 'vue'
import type { Loader } from 'merak-core'
import { shareEmits, shareProps } from './share'
export const vueSSRLoader = new SSRLoader()
export const MerakSSR = defineComponent({
  inheritAttrs: false,
  props: {
    ...shareProps,
    loader: {
      type: Object as PropType<Loader>,
      default: vueSSRLoader,
    },
    route: {
      type: String,
    },
  },
  emits: shareEmits,
  setup(props, { expose, emit }) {
    const { proxy, iframe, props: MerakProps, name, loader, url, route } = props
    const app = getInstance(name) || new Merak(name, url, { proxy, iframe, loader })
    if (MerakProps)
      app.props = MerakProps

    for (const ev in shareEmits) {
      if (!app.lifeCycle[ev])
        app.lifeCycle[ev] = (arg: any) => emit(ev as any, arg)
    }
    if (route)
      $$jump(props.name, route, false)

    watch(() => props.route, (n) => {
      n && $$jump(props.name, n)
    })

    expose({ app })
    return () => h('merak-app', { [MERAK_DATA_ID]: props.name, [MERAK_KEEP_ALIVE]: props.keepAlive })
  },
})
