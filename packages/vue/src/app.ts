import type { Loader } from 'merak-core'
import { $$jump, CompileLoader, MERAK_DATA_ID, MERAK_KEEP_ALIVE, Merak, getInstance } from 'merak-core'
import type { PropType } from 'vue'
import { defineComponent, h, onMounted, onUnmounted, watch } from 'vue'

import { shareEmits, shareProps } from './share'
export const vueLoader = new CompileLoader()
export const MerakApp = defineComponent({
  inheritAttrs: false,
  props: {
    ...shareProps,
    loaderOptions: {
      type: Object as PropType<any>,
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
    const { url, proxy, loader, loaderOptions, props: MerakProps, iframe, name, route } = props
    const app = getInstance(name) || new Merak(name, url, { loader, loaderOptions, proxy, iframe })
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

    expose({ app })
    if (route)
      $$jump(props.name, route, false)

    watch(() => props.route, (n) => {
      n && $$jump(props.name, n)
    })
    return () => h('merak-app', { [MERAK_DATA_ID]: props.name, [MERAK_KEEP_ALIVE]: props.keepAlive })
  },
})
