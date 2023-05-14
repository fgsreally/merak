import { MERAK_DATA_ID, MERAK_KEEP_ALIVE } from './common'
import { Merak } from './merak'
import { getInstance } from './helper'

export function defineWebComponent() {
  class MerakApp extends HTMLElement {
    templateNode: HTMLTemplateElement
    async connectedCallback() {
      if (this.shadowRoot)
        return

      const id = this.getAttribute(MERAK_DATA_ID) as string

      if (!id) {
        Merak.errorHandler({ type: 'missProperty', message: `set ${MERAK_DATA_ID} to merak-app` })
        return
      }
      const app = getInstance(id) as Merak
      if (!app) {
        Merak.errorHandler({ type: 'missInstance', message: `can't find app [${id}] ` })
        return
      }
      await app.load()

      if (app.mountFlag) {
        if (__DEV__)
          console.warn(` app [${id}] has been mounted`)
        // work for preload
        if (app.execPromise) {
          await app.execPromise
          app.unmount(true)
        }
        else {
          // work for preload
          app.errorHandler({ type: 'hasMount', message: ` app [${id}] has been mounted` })
          return
        }
      }
      const shadowRoot = this.attachShadow({ mode: 'open' })
      app.shadowRoot = shadowRoot

      app.mount()
    }

    disconnectedCallback(): void {
      const app = getInstance(this.id) as Merak
      const isKeepAlive = this.hasAttribute(MERAK_KEEP_ALIVE) && this.getAttribute(MERAK_KEEP_ALIVE) !== 'false'

      app.unmount(isKeepAlive)
    }
  }

  // class MerakApp extends HTMLElement {
  //   async connectedCallback() {
  //     if (this.shadowRoot)
  //       return

  //     const id = this.getAttribute(MERAK_DATA_ID) as string

  //     const app = getInstance(id) as Merak
  //     if (!app)
  //       throw new Error(`can't find app [${id}] `)

  //     if (app.mountFlag) {
  //       if (__DEV__)
  //         throw new Error(` app [${id}] has been mounted`)
  //       return
  //     }

  //     const shadowRoot = this.attachShadow({ mode: 'open' })
  //     app.shadowRoot = shadowRoot

  //     await app.load()

  //     app.mount()
  //   }

  //   disconnectedCallback(): void {
  //     const id = this.getAttribute(MERAK_DATA_ID) as string
  //     const app = getInstance(id) as Merak
  //     const isKeepAlive = this.hasAttribute(MERAK_KEEP_ALIVE) && this.getAttribute(MERAK_KEEP_ALIVE) !== 'false'

  //     app.unmount(isKeepAlive)
  //   }
  // }
  customElements.define('merak-app', MerakApp)
}

defineWebComponent()
