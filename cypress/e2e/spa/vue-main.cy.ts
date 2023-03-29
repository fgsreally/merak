import { MAINAPP_URL } from '../common'

import { checkModalColor, isSymbolExist } from '../utils'

describe('main vue app [dev mode]', () => {
  beforeEach(() => {
    cy.wait(1000)
    cy.visit(`${MAINAPP_URL.VUE}about`)
    cy.wait(1000)
  })
  it('should work', () => {
    isSymbolExist()
  })
  it('sub app should hidden and relunch/mount', () => {
    cy.get('a[href=\'/\']').click()
    cy.get('a[href=\'/about\']').click()

    isSymbolExist()
  })

  it('style should be different', () => {
    checkModalColor()
  })
})
