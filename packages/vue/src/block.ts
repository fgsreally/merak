/* eslint-disable vue/one-component-per-file */
import type { PropType, VNode } from 'vue'
import { defineComponent, h, nextTick, onBeforeUnmount, onMounted, render } from 'vue'
import { MERAK_DATA_ID, MERAK_KEEP_ALIVE, Merak, createLibProxy, getInstance } from 'merak-core'
import { $location } from 'merak-helper'
import { shareProps } from './share'

const shareNativeVars = ['document', 'window', 'self', 'globalThis', 'setTimeout', 'setInterval']

const shareLibProps = {
  nativeVars: {
    type: Array as PropType<string[]>,

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
    url: {
      type: String,
      required: false as const,
      default: $location().origin,
    },
    source:{
      type: String,
      required: true as const,
    }
    globals: {
      type: Array as PropType<string[]>,
    },
  },
  setup(props, { slots }) {
    const { fakeGlobalVar, name, url, props: MerakProps, proxy, iframe, nativeVars = shareNativeVars, customVars = [],source } = props

    const app = getInstance(name) || new Merak(name,  url, { proxy: proxy || createLibProxy(name, url), iframe })
    app.setGlobalVars(fakeGlobalVar, nativeVars, customVars)

    let vnode: VNode

    onMounted(async () => {
      const { default: Comp } = await import(source)
      vnode = h(Comp, { ...MerakProps }, slots)
      render(vnode, app.sandDocument!.querySelector('body')!)
    })

    onBeforeUnmount(() => {
      render(null, app.sandDocument!.querySelector('body')!)
    })

    return () => h('merak-app', { [MERAK_DATA_ID]: props.name, [MERAK_KEEP_ALIVE]: props.keepAlive })
  },
})

export const MerakScope = defineComponent({
  props: {
    ...shareProps,
    ...shareLibProps,

    url: {
      type: String,
      required: false as const,
      default: $location().origin,
    },
    fakeGlobalVar: {
      type: String,
      required: true as const,
    },

  },
  // emits: shareEmits,
  setup(props, { slots }) {
    const { fakeGlobalVar, name, proxy, iframe, url, nativeVars = shareNativeVars, customVars = [] } = props

    const app = getInstance(name) || new Merak(name, url, { proxy: proxy || createLibProxy(name, url), iframe })

    app.setGlobalVars(fakeGlobalVar, nativeVars, customVars)

    onMounted(async () => {
      await nextTick()
      render(slots.default!()[0], app.sandDocument!.querySelector('body')!)
    })

    onBeforeUnmount(() => {
      render(null, app.sandDocument!.querySelector('body')!)
    })

    return () => h('merak-app', { [MERAK_DATA_ID]: props.name, [MERAK_KEEP_ALIVE]: props.keepAlive })
  },
})
