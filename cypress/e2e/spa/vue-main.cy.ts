import { MAINAPP_URL } from '../common'

import { isSymbolExist } from '../utils'

describe('main vue app [dev mode]', () => {
  beforeEach(() => {
    cy.visit(`${MAINAPP_URL.VUE}`)
    cy.get('a[href=\'/about\']').click()
    cy.wait(3000)
  })
  it('should work', () => {
    isSymbolExist()
  })
  it('sub app should hidden and relunch/mount', () => {
    cy.get('a[href=\'/\']').click()
    cy.get('a[href=\'/about\']').click()

    isSymbolExist()
  })
})
