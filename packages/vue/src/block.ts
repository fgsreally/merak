import { defineComponent, h, onMounted, onUnmounted, render } from 'vue'
import { MERAK_DATA_FAKEGLOBALVAR, MERAK_DATA_ID, MERAK_KEEP_ALIVE, Merak, createLibProxy, getInstance } from 'merak-core'
import { shareEmits, shareProps } from './share'

export const MerakBlock = defineComponent({
  props: {
    ...shareProps,
  },
  emits: shareEmits,
  setup(props, { slots, emit }) {
    const { name, id, url, props: MerakProps, proxy = createLibProxy(name, url), iframe, keepAlive } = props

    const app = getInstance(id || name) || new Merak(id || name, url, { proxy, iframe })
    for (const ev of shareEmits)
      app.lifeCycle[ev] = (arg: any) => emit(ev, arg)

    const importPromise = import(url)
    onMounted(async () => {
      const { default: Comp } = await importPromise
      render(h(Comp, { ...MerakProps }, slots), app.sandDocument!.querySelector('body')!)
    })
    onUnmounted(() => {
      app.unmount(false)
    })

    return () => h('merak-block', { [MERAK_DATA_ID]: id || name, [MERAK_DATA_FAKEGLOBALVAR]: name, [MERAK_KEEP_ALIVE]: keepAlive })
  },
})
