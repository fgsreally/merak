import { MAINAPP_URL } from '../common'

import { isSymbolExist } from '../utils'

describe('main vue app', () => {
  beforeEach(() => {
    cy.visit(`${MAINAPP_URL.VUE}`)
    cy.get('a[href=\'/about\']').click()
  })
  it('should work', () => {
    isSymbolExist(['vite_vue', 'vite_react', 'vue_cli'])
  })
  it('sub app should hidden and relunch/mount', () => {
    cy.get('a[href=\'/\']').click()
    cy.get('a[href=\'/about\']').click()

    isSymbolExist(['vite_vue', 'vite_react', 'vue_cli'])
  })
})
