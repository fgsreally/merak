import { MAINAPP_URL } from '../common'

import { checkModalColor, getShadowSelector, isSymbolExist } from '../utils'

describe('vue ssr [dev mode]', () => {
  beforeEach(() => {
    cy.visit(`${MAINAPP_URL.VUE_SSR}`)
  })
  it('should mount template on body', () => {
    cy.get('[data-merak-ssr="vite_vue"]').should('exist')
  })

  it('should work', () => {
    cy.get('a[href="/test/about"]').click()

    cy.get(getShadowSelector('vite_vue')).should('exist')
  })
})
