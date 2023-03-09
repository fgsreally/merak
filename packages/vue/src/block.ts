import type { PropType } from 'vue'
import { defineComponent, h, onMounted, onUnmounted, render } from 'vue'
import type { CustomProxyHandler } from 'merak-core'
import { MERAK_DATA_ID, MERAK_DATA_VARNAME, MERAK_KEEP_ALIVE, Merak, flow, libHandler, noop } from 'merak-core'

export const MerakBlock = defineComponent({
  props: {
    // fakeGlobalName & project id
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    props: {
      type: Object as PropType<any>,
      // required: true,
    },
    customHandler: {
      type: Function as PropType<CustomProxyHandler>,
      default: noop,
    },
  },
  setup(props, { slots }) {
    const { name, url, props: MerakProps, customHandler } = props

    const app = new Merak(name, url, { customHandler: flow(libHandler, customHandler) })
    const importPromise = import(url)
    onMounted(async () => {
      const { default: Comp } = await importPromise
      render(h(Comp, { ...MerakProps }, slots), app.sandDocument!.querySelector('body')!)
    })
    onUnmounted(() => {
      app.unmount(false)
    })

    return () => h('merak-block', { [MERAK_DATA_ID]: props.name, [MERAK_DATA_VARNAME]: name, [MERAK_KEEP_ALIVE]: true })
  },
})
