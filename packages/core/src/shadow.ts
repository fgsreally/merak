import { MERAK_DATA_ID, MERAK_FLAG } from './common'
import { Merak } from './merak'
import { getApp } from './helper'
import { debug } from './utils'

export function defineWebComponent() {
  class MerakApp extends HTMLElement {
    templateNode: HTMLTemplateElement
    static get observedAttributes() {
      return [MERAK_DATA_ID]
    }

    /**
 * @experiment
 */
    attributeChangedCallback(_: string, oldVal: string, newVal: string) {
      if (newVal === oldVal)
        return
      const app = getApp(oldVal)
      if (!app)
        return

      app.unmount('destroy')
      this.connectedCallback()
    }

    async connectedCallback() {
      const id = this.getAttribute(MERAK_DATA_ID) as string

      if (!id) {
        Merak.errorHandler({ type: 'missProperty', error: new Error(`set ${MERAK_DATA_ID} to merak-app`) })
        return
      }
      debug('connected', id)
      const app = getApp(id) as Merak
      if (!app) {
        Merak.errorHandler({ type: 'missInstance', error: new Error(`can't find app [${id}] `) })
        return
      }

      await app.load()

      if (app.mountFlag) {
        debug('has been mounted', id)
        // work for preload
        if (app.preloadStat) {
          await app.execPromise
          app.unmount(app.preloadStat === 'script' ? 'hidden' : 'relunch')
          app.preloadStat = false
        }
        else {
          app.errorHandler({ type: 'hasMount', error: new Error(` app [${id}] has been mounted`) })
          return
        }
      }

      app.shadowRoot = this.attachShadow({ mode: 'open' })

      app.mount()
    }

    disconnectedCallback() {
      const id = this.getAttribute(MERAK_DATA_ID)!
      debug('disconnected', id)
      const app = getApp(id)!
      app.unmount(this.getAttribute(MERAK_FLAG) || 'destroy')
    }
  }

  if (!customElements.get('merak-app'))
    customElements.define('merak-app', MerakApp)
}

defineWebComponent()
