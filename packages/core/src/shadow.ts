import { MERAK_DATA_ID, MERAK_KEEP_ALIVE } from './common'
import { Merak } from './merak'
import { getInstance } from './helper'

export function defineWebComponent() {
  class MerakApp extends HTMLElement {
    templateNode: HTMLTemplateElement
    static get observedAttributes() {
      return [MERAK_DATA_ID]
    }

    attributeChangedCallback(_: string, oldVal: string, newVal: string) {
      if (newVal === oldVal)
        return
      const app = getInstance(oldVal)
      if (!app)
        return

      app.unmount(false)
      this.connectedCallback()
    }

    async connectedCallback() {
      // if (this.shadowRoot)
      //   return
      const id = this.getAttribute(MERAK_DATA_ID) as string

      if (!id) {
        Merak.errorHandler({ type: 'missProperty', error: new Error(`set ${MERAK_DATA_ID} to merak-app`) })
        return
      }
      const app = getInstance(id) as Merak
      if (!app) {
        Merak.errorHandler({ type: 'missInstance', error: new Error(`can't find app [${id}] `) })
        return
      }

      await app.load()

      if (app.mountFlag) {
        if (__DEV__)
          console.warn(` app [${id}] has been mounted`)
        // work for preload
<<<<<<< HEAD
        if (app.isPreload) {
          await app.execPromise
          app.isPreload = false
          app.unmount(true)
=======
        if (app.preloadStat) {
          await app.execPromise
          app.unmount(app.preloadStat === 'script')
          app.preloadStat = false
>>>>>>> main
        }
        else {
          app.errorHandler({ type: 'hasMount', error: new Error(` app [${id}] has been mounted`) })
          return
        }
      }

      app.shadowRoot = this.attachShadow({ mode: 'open' })

      app.mount()
    }

<<<<<<< HEAD
    disconnectedCallback(): void {
      const id = this.getAttribute(MERAK_DATA_ID)!
      const app = getInstance(id)!
      const isKeepAlive = this.hasAttribute(MERAK_KEEP_ALIVE) && this.getAttribute(MERAK_KEEP_ALIVE) !== 'false'

      app.unmount(isKeepAlive)
=======
    disconnectedCallback() {
      const id = this.getAttribute(MERAK_DATA_ID)!
      const app = getInstance(id)!
      app.unmount(this.hasAttribute(MERAK_KEEP_ALIVE) && this.getAttribute(MERAK_KEEP_ALIVE) !== 'false')
>>>>>>> main
    }
  }

  if (!customElements.get('merak-app'))
    customElements.define('merak-app', MerakApp)
}

defineWebComponent()
