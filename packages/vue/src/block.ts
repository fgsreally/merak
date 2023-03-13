import type { PropType } from 'vue'
import { defineComponent, h, onMounted, onUnmounted, render } from 'vue'
import type { ProxyGlobals } from 'merak-core'
import { MERAK_DATA_ID, MERAK_DATA_VARNAME, MERAK_KEEP_ALIVE, Merak, createLibProxy } from 'merak-core'

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
    proxy: {
      type: Object as PropType<ProxyGlobals>,

    },
  },
  setup(props, { slots }) {
    const { name, url, props: MerakProps, proxy = createLibProxy(name, url) } = props

    const app = new Merak(name, url, { proxy })
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
