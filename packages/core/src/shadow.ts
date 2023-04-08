import { MERAK_DATA_FAKEGLOBALVAR, MERAK_DATA_ID, MERAK_KEEP_ALIVE } from './common'
import type { Merak } from './merak'
import { getInstance } from './composable'

export function defineWebComponent() {
  class MerakBlock extends HTMLElement {
    async connectedCallback() {
      if (this.shadowRoot)
        return

      const id = this.getAttribute(MERAK_DATA_ID) as string
      const fakeGlobalVar = this.getAttribute(MERAK_DATA_FAKEGLOBALVAR) as string
      const app = getInstance(id) as Merak
      if (!app)
        throw new Error(`can't find app [${id}] `)
      if (app.mountFlag) {
        if (__DEV__)
          throw new Error(` app [${id}] has been mounted`)
        return
      }

      const shadowRoot = this.attachShadow({ mode: 'open' })
      app.shadowRoot = shadowRoot
      if (!app.activeFlag)
        app.setGlobalVar(fakeGlobalVar)

      app.mount()
    }

    disconnectedCallback(): void {
      const id = this.getAttribute(MERAK_DATA_ID) as string
      const app = getInstance(id) as Merak
      const isKeepAlive = this.hasAttribute(MERAK_KEEP_ALIVE) && this.getAttribute(MERAK_KEEP_ALIVE) !== 'false'

      app.unmount(isKeepAlive)
    }
  }

  class MerakSSR extends HTMLElement {
    templateNode: HTMLTemplateElement
    id: string
    async connectedCallback() {
      if (this.shadowRoot)
        return
      if (!this.id)
        this.id = this.getAttribute(MERAK_DATA_ID) as string
      const id = this.id

      if (!id)
        throw new Error(`set ${MERAK_DATA_ID} to merak-ssr`)

      if (!this.templateNode)
        this.templateNode = document.querySelector(`[data-merak-ssr='${id}']`) as HTMLTemplateElement

      const templateNode = this.templateNode
      const app = getInstance(id) as Merak

      if (!app)
        throw new Error(`can't find app [${id}] `)
      if (app.mountFlag) {
        if (__DEV__)
          throw new Error(` app [${id}] has been mounted`)
        return
      }
      if (!templateNode)
        throw new Error(` can't find [${id}] template`)

      const shadowRoot = this.attachShadow({ mode: 'open' })
      app.shadowRoot = shadowRoot
      if (!app.activeFlag) {
        const { _f: fakeGlobalVar } = JSON.parse(templateNode.getAttribute('merak-config')!) as {
          _f: string
        }
        app.setGlobalVar(fakeGlobalVar)
      }
      app.mount(app.cacheFlag ? undefined : templateNode.content.cloneNode(true) as any)
    }

    disconnectedCallback(): void {
      const app = getInstance(this.id) as Merak
      const isKeepAlive = this.hasAttribute(MERAK_KEEP_ALIVE) && this.getAttribute(MERAK_KEEP_ALIVE) !== 'false'
      if (!isKeepAlive)
        this.templateNode.innerHTML = app.sandDocument!.innerHTML

      app.unmount(isKeepAlive)
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
        shadowRoot.appendChild(app.sandDocument!)
        return
      }

      if (app.mountFlag) {
        if (__DEV__)
          throw new Error(` app [${id}] has been mounted`)
        return
      }

      const shadowRoot = this.attachShadow({ mode: 'open' })
      app.shadowRoot = shadowRoot

      await app.load()

      app.mount()
    }

    disconnectedCallback(): void {
      const id = this.getAttribute(MERAK_DATA_ID) as string
      const app = getInstance(id) as Merak
      const isKeepAlive = this.hasAttribute(MERAK_KEEP_ALIVE) && this.getAttribute(MERAK_KEEP_ALIVE) !== 'false'

      app.unmount(isKeepAlive)
    }
  }
  customElements.define('merak-app', MerakApp)
  customElements.define('merak-ssr', MerakSSR)
  customElements.define('merak-block', MerakBlock)
}

defineWebComponent()
