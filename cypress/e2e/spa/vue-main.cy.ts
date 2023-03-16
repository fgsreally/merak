import { MAINAPP_URL, SUBAPP_BG_STYLE, SUBAPP_CONTENT, SUBAPP_NAME } from '../common'

import { getModal, getModalBtn, getShadowSelector } from '../utils'

function isSymbolExist() {
  for (const id of SUBAPP_NAME)
    cy.get(getShadowSelector(id)).shadow().find('.merak-symbol').contains(SUBAPP_CONTENT[id])
}

function checkModalColor() {
  for (const id of SUBAPP_NAME) {
    cy.get(getShadowSelector(id)).shadow().find('a[href=\'/about\']').click()
    cy.get(getShadowSelector(id)).shadow().find(getModalBtn()).click()
    cy.get(getShadowSelector(id)).shadow().find(getModal()).should('have.css', 'background-color', SUBAPP_BG_STYLE[id])
  }
}
describe('main vue app [dev mode]', () => {
  beforeEach(() => {
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
