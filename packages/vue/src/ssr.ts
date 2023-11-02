import { $$jump, MERAK_DATA_ID, MERAK_FLAG, Merak, SSRLoader, getInstance } from 'merak-core'
import type { PropType } from 'vue'
import { defineComponent, h, onBeforeUnmount, onMounted, onUnmounted, watch } from 'vue'
import type { Loader } from 'merak-core'
import { shareEmits, shareProps } from './share'
export const vueSSRLoader = new SSRLoader()
export const MerakSSR = defineComponent({
  inheritAttrs: true,
  props: {
    ...shareProps,
    loader: {
      type: Object as PropType<Loader>,
      default: vueSSRLoader,
    },
    loaderOptions: {
      type: Object as PropType<any>,
    },
    route: {
      type: String,
    },
  },
  emits: shareEmits,
  setup(props, { expose, emit }) {
    const { proxy, iframe, props: MerakProps, name, loader, url, route, timeout, loaderOptions, inlineStyle } = props
    const app = getInstance(name) || new Merak(name, url, { proxy, iframe, loader, timeout, loaderOptions })

    onBeforeUnmount(() => {
      if (inlineStyle)
        app.storeCSSLink()
    })

    if (MerakProps)
      app.props = MerakProps

    for (const ev in shareEmits) {
      const task = app.lifeCycle[ev]
      const hook = (arg: any) => {
        task?.(arg)
        emit(ev as any, arg)
      }
      onMounted(() => {
        app.lifeCycle[ev] = hook
      })

      onUnmounted(() => {
        if (app.lifeCycle[ev] === hook)
          app.lifeCycle[ev] = task
      })
    }
    if (route)
      $$jump(props.name, route, false)

    watch(() => props.route, (n) => {
      n && $$jump(props.name, n)
    })

    expose({ app })
    return () => h('merak-app', { [MERAK_DATA_ID]: props.name, [MERAK_FLAG]: props.flag })
  },
})
