import type { Loader, MerakConfig } from 'merak-core'
import { $$jump, MERAK_DATA_ID, MERAK_KEEP_ALIVE, Merak, PureLoader, getInstance } from 'merak-core'
import type { PropType } from 'vue'
import { defineComponent, h, watch } from 'vue'
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
    route: {
      type: String,
    },

  },
  emits: shareEmits,
  setup(props, { emit, expose }) {
    const { url, proxy, loader, configOrUrl, props: MerakProps, iframe, name, route } = props
    const app = getInstance(name) || new Merak(name, url, { loader, configOrUrl, proxy, iframe })
    if (MerakProps)
      app.props = MerakProps
    for (const ev in shareEmits) {
      if (!app.lifeCycle[ev])
        app.lifeCycle[ev] = (arg: any) => emit(ev as any, arg)
    }
    expose({ app })
    if (route)
      $$jump(props.name, route, false)

    watch(() => props.route, (n) => {
      n && $$jump(props.name, n)
    })
    return () => h('merak-app', { [MERAK_DATA_ID]: props.name, [MERAK_KEEP_ALIVE]: props.keepAlive })
  },
})
