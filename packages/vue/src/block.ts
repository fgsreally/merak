import { defineComponent, h, onMounted, onUnmounted, render } from 'vue'
import { MERAK_DATA_FAKEGLOBALVAR, MERAK_DATA_ID, MERAK_EVENT_PREFIX, MERAK_KEEP_ALIVE, Merak, createLibProxy, getInstance } from 'merak-core'
import { $window } from 'merak-helper'
import { shareEmits, shareProps } from './share'

export const MerakBlock = defineComponent({
  props: {
    ...shareProps,
    fakeGlobalVar: {
      type: String,
      required: true as const,
    },
  },
  emits: shareEmits,
  setup(props, { slots, emit }) {
    const { fakeGlobalVar, name, url, props: MerakProps, proxy = createLibProxy(fakeGlobalVar, url), iframe, keepAlive } = props

    const app = getInstance(name) || new Merak(name, url, { proxy, iframe })
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

    return () => h('merak-block', { [MERAK_DATA_ID]: name, [MERAK_DATA_FAKEGLOBALVAR]: fakeGlobalVar, [MERAK_KEEP_ALIVE]: keepAlive })
  },
})
