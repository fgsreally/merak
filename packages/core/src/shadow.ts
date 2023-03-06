import { MERAK_DATA_ID, MERAK_DATA_VARNAME, MERAK_KEEP_ALIVE } from './common'
import type { Merak } from './merak'
import { getInstance } from './composable'

export function defineWebComponent() {
  class MerakBlock extends HTMLElement {
    async connectedCallback() {
      if (this.shadowRoot)
        return

      const id = this.getAttribute(MERAK_DATA_ID) as string
      const fakeGlobalName = this.getAttribute(MERAK_DATA_VARNAME) as string
      const app = getInstance(id) as Merak
      if (!app)
        throw new Error(`can't find app [${id}] `)
      if (app.mountFlag) {
        if (DEV)
          throw new Error(` app [${id}] has been mounted`)
        return
      }

      const shadowRoot = this.attachShadow({ mode: 'open' })
      app.shadowRoot = shadowRoot
      if (!app.activeFlag) {
        app.fakeGlobalName = fakeGlobalName
        window[fakeGlobalName] = app.proxy
        app.activeFlag = true
      }
      app.mount()
    }

    disconnectedCallback(): void {
      const id = this.getAttribute(MERAK_DATA_ID) as string
      const app = getInstance(id) as Merak
      app.unmount(Boolean(this.getAttribute(MERAK_KEEP_ALIVE)))
    }
  }

  class MerakSSR extends HTMLElement {
    async connectedCallback() {
      if (this.shadowRoot)
        return

      const id = this.getAttribute(MERAK_DATA_ID) as string

      const app = getInstance(id) as Merak
      if (!app)
        throw new Error(`can't find app [${id}] `)
      if (app.mountFlag) {
        if (DEV)
          throw new Error(` app [${id}] has been mounted`)
        return
      }
      const templateNode = document.getElementById(id) as HTMLTemplateElement
      if (!templateNode)
        throw new Error(` can't find [${id}] template`)

      const shadowRoot = this.attachShadow({ mode: 'open' })
      app.shadowRoot = shadowRoot
      if (!app.activeFlag) {
        const { fakeGlobalName } = JSON.parse(templateNode.getAttribute('merak-config')!) as {
          fakeGlobalName: string
        }
        app.fakeGlobalName = fakeGlobalName
        window[fakeGlobalName] = app.proxy
        app.activeFlag = true
      }
      app.mount(app.cacheFlag ? undefined : templateNode.content.cloneNode() as any)
    }

    disconnectedCallback(): void {
      const id = this.getAttribute(MERAK_DATA_ID) as string
      const app = getInstance(id) as Merak
      app.unmount(Boolean(this.getAttribute(MERAK_KEEP_ALIVE)))
    }
  }

  class MerakApp extends HTMLElement {
    async connectedCallback() {
      if (this.shadowRoot)
        return

      const id = this.getAttribute(MERAK_DATA_ID) as string

      const app = getInstance(id) as Merak
      if (!app)
        throw new Error(`can't find app [${id}] `)
      if (app.isRender) {
        const shadowRoot = this.attachShadow({ mode: 'open' })
        app.shadowRoot = shadowRoot
        app.mount()
        return
      }

      if (app.mountFlag) {
        if (DEV)
          throw new Error(` app [${id}] has been mounted`)
        return
      }

      const shadowRoot = this.attachShadow({ mode: 'open' })
      app.shadowRoot = shadowRoot

      if (!app.activeFlag)
        await app.load()

      app.mount()
    }

    disconnectedCallback(): void {
      const id = this.getAttribute(MERAK_DATA_ID) as string
      const app = getInstance(id) as Merak
      app.unmount(this.getAttribute(MERAK_KEEP_ALIVE) as any)
    }
  }

  customElements.define('merak-app', MerakApp)
  customElements.define('merak-ssr', MerakSSR)
  customElements.define('merak-block', MerakBlock)
}

defineWebComponent()
