/* eslint-disable vue/one-component-per-file */
import type { PropType, VNode } from 'vue'
import { defineComponent, h, nextTick, onBeforeUnmount, onMounted, render } from 'vue'
import { MERAK_DATA_ID, MERAK_KEEP_ALIVE, Merak, createLibProxy, getInstance } from 'merak-core'
import { $location } from 'merak-helper'
import { shareEmits, shareProps } from './share'

const shareLibProps = {
  nativeVars: {
    type: Array as PropType<string[]>,
    default: ['document', 'window', 'self', 'globalThis', 'setTimeout', 'setInterval'],
  },
  customVars: {
    type: Array as PropType<string[]>,
  },
}
export const MerakImport = defineComponent({
  props: {
    ...shareLibProps,
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
    const { fakeGlobalVar, name, url, props: MerakProps, proxy, iframe, keepAlive, nativeVars = [], customVars = [] } = props

    const app = getInstance(name) || new Merak(name, url, { proxy: proxy || createLibProxy(name, url), iframe })
    app.setGlobalVars(fakeGlobalVar, nativeVars, customVars)

    let vnode: VNode
    for (const ev in shareEmits) {
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

export const MerakScope = defineComponent({
  props: {
    ...shareProps,
    ...shareLibProps,

    url: {
      type: String,
      required: false as const,
      default: $location().href,
    },
    fakeGlobalVar: {
      type: String,
      required: true as const,
    },

  },
  emits: shareEmits,
  setup(props, { slots, emit }) {
    const { fakeGlobalVar, name, url, props: MerakProps, proxy, iframe, keepAlive, nativeVars = [], customVars = [] } = props

    const app = getInstance(name) || new Merak(name, url, { proxy: proxy || createLibProxy(name, url), iframe })

    app.setGlobalVars(fakeGlobalVar, nativeVars, customVars)
    app.props = MerakProps
    for (const ev in shareEmits)
      app.lifeCycle[ev] = (arg: any) => emit(ev as any, arg)

    onMounted(async () => {
      await nextTick()
      render(slots.default!()[0], app.sandDocument!.querySelector('body')!)
    })

    onBeforeUnmount(() => {
      render(null, app.sandDocument!.querySelector('body')!)
    })

    return () => h('merak-app', { [MERAK_DATA_ID]: name, [MERAK_KEEP_ALIVE]: keepAlive })
  },
})
