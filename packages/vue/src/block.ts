import type { PropType, VNode } from 'vue'
import { defineComponent, h, onBeforeUnmount, onMounted, render } from 'vue'
import { MERAK_DATA_ID, MERAK_KEEP_ALIVE, Merak, createLibProxy, getInstance } from 'merak-core'
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

    let vnode: VNode
    for (const ev in shareEmits) {
      if (ev === 'errorHandler')
        app[ev] = (arg: any) => emit(ev as any, arg)
      else
        app.lifeCycle[ev] = (arg: any) => emit(ev as any, arg)
    }
    // const importPromise = import(url)
    onMounted(async () => {
      // const { default: Comp } = await importPromise
      const { default: Comp } = await import(url)
      vnode = h(Comp, { ...MerakProps }, slots)
      render(vnode, app.sandDocument!.querySelector('body')!)
    })

    onBeforeUnmount(() => {
      render(null, app.sandDocument!.querySelector('body')!)
    })

    return () => h('merak-app', { [MERAK_DATA_ID]: name, [MERAK_KEEP_ALIVE]: keepAlive })
  },
})
