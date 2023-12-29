import { MAINAPP_URL, SUBAPP_URL } from '../common'
import { isSymbolExist } from '../utils'

describe('vue ssr app', () => {
  beforeEach(() => {
    cy.visit(`${MAINAPP_URL.VUE_SSR}`)
    cy.wait(1000)
  })
  it('should mount template on body', () => {
    cy.get(`[data-merak-url='${SUBAPP_URL.vite_vue}/index.html']`).should('exist')
  })

  it('should work', () => {
    cy.get('a[href="/about"]').click()
    isSymbolExist(['vite_vue'])
  })
})
