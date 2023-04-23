import { defineComponent, h, onMounted, onUnmounted, render } from 'vue'
import { MERAK_DATA_FAKEGLOBALVAR, MERAK_DATA_ID, MERAK_KEEP_ALIVE, Merak, createLibProxy, getInstance } from 'merak-core'
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
    // for (const ev in shareEmits)
    //   app.lifeCycle[ev] = (arg: any) => emit(ev as any, arg)

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
