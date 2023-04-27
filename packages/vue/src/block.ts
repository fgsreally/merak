import type { PropType } from 'vue'
import { defineComponent, h, onMounted, onUnmounted, render } from 'vue'
import { MERAK_DATA_ID, MERAK_EVENT_PREFIX, MERAK_KEEP_ALIVE, Merak, createLibProxy, getInstance } from 'merak-core'
import { $window } from 'merak-helper'
import { shareEmits, shareProps } from './share'

export const MerakBlock = defineComponent({
  props: {
    ...shareProps,
    fakeGlobalVar: {
      type: String,
      required: true as const,
    },
    globals: {
      type: Array as PropType<string[]>,
    },
  },
  emits: shareEmits,
  setup(props, { slots, emit }) {
    const { fakeGlobalVar, name, url, props: MerakProps, proxy, iframe, keepAlive, globals = [] } = props

    const app = getInstance(name) || new Merak(name, url, { proxy: proxy || createLibProxy(name, url), iframe })
    app.setGlobalVars(fakeGlobalVar, globals)
    for (const ev in shareEmits) {
      const eventName = MERAK_EVENT_PREFIX + ev + name
      const handler = () => emit(ev as any, name)
      const window = $window()
      window.addEventListener(eventName, handler)
      onUnmounted(() => window.removeEventListener(eventName, handler))
    }
    const importPromise = import(url)
    onMounted(async () => {
      const { default: Comp } = await importPromise
      render(h(Comp, { ...MerakProps }, slots), app.sandDocument!.querySelector('body')!)
    })
    onUnmounted(() => {
      app.unmount(false)
    })

    return () => h('merak-app', { [MERAK_DATA_ID]: name, [MERAK_KEEP_ALIVE]: keepAlive })
  },
})
