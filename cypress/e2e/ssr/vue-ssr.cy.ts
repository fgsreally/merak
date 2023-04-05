import { MAINAPP_URL, SUBAPP_CONTENT } from '../common'
import { getShadowSelector } from '../utils'

describe('vue ssr [dev mode]', () => {
  beforeEach(() => {
    cy.visit(`${MAINAPP_URL.VUE_SSR}`)
    cy.wait(1000)
  })
  it('should mount template on body', () => {
    cy.get('[data-merak-ssr="vite_vue"]').should('exist')
  })

  it('should work', () => {
    cy.get('a[href="/test/about"]').click()
    cy.get(getShadowSelector('vite_vue')).shadow().find('.merak-symbol').contains(SUBAPP_CONTENT.vite_vue)
  })
})
