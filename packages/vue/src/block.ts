/* eslint-disable vue/one-component-per-file */
import type { PropType, VNode } from 'vue'
import { defineComponent, h, nextTick, onBeforeUnmount, onMounted, render } from 'vue'
import { MERAK_DATA_ID, MERAK_FLAG, Merak, createLibProxy, getInstance } from 'merak-core'
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
  inheritAttrs: true,

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
    head: {
      type: String,
    },
    source: {
      type: String,
      required: true as const,
    },
    deactive: {
      type: Boolean,
      default: true,
    },
    globals: {
      type: Array as PropType<string[]>,
    },
  },
  setup(props, { slots }) {
    const { fakeGlobalVar, deactive, head, name, url, props: MerakProps, proxy, iframe, nativeVars = shareNativeVars, customVars = [], source, timeout } = props
    const app = getInstance(name) || new Merak(name, url, { proxy: proxy || createLibProxy(name, url), iframe, timeout })
    if (!app.fakeGlobalVar)
      app.setGlobalVars(fakeGlobalVar, nativeVars, customVars)

    let vnode: VNode

    onMounted(async () => {
      await nextTick()
      if (head)
        app.sandHtml!.querySelector('head')!.innerHTML = head
      const { default: Comp } = await import(/* @vite-ignore */source)
      vnode = h(Comp, { ...MerakProps }, slots)
      render(vnode, app.sandHtml!.querySelector('body')!)
    })

    onBeforeUnmount(() => {
      render(null, app.sandHtml!.querySelector('body')!)
      deactive && app.deactive()
    })

    return () => h('merak-app', { [MERAK_DATA_ID]: props.name, [MERAK_FLAG]: props.flag })
  },
})

export const MerakScope = defineComponent({
  inheritAttrs: true,

  props: {
    ...shareProps,
    ...shareLibProps,

    url: {
      type: String,
      required: false as const,
      default: $location().origin,
    },
    head: {
      type: String,
    },
    deactive: {
      type: Boolean,
      default: true,
    },
    fakeGlobalVar: {
      type: String,
      required: true as const,
    },

  },
  // emits: shareEmits,
  setup(props, { slots }) {
    const { fakeGlobalVar, deactive, head, name, proxy, iframe, url, nativeVars = shareNativeVars, customVars = [], timeout } = props

    const app = getInstance(name) || new Merak(name, url, { proxy: proxy || createLibProxy(name, url), iframe, timeout })

    if (!app.fakeGlobalVar)
      app.setGlobalVars(fakeGlobalVar, nativeVars, customVars)

    onMounted(async () => {
      await nextTick()
      if (head)
        app.sandHtml!.querySelector('head')!.innerHTML = head

      render(slots.default!()[0], app.sandHtml!.querySelector('body')!)
    })

    onBeforeUnmount(() => {
      render(null, app.sandHtml!.querySelector('body')!)
      deactive && app.deactive()
    })

    return () => h('merak-app', { [MERAK_DATA_ID]: props.name, [MERAK_FLAG]: props.flag })
  },
})
