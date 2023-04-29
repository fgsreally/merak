import { MAINAPP_URL } from '../common'

import { isSymbolExist } from '../utils'

describe('vanilla app ', () => {
  beforeEach(() => {
    cy.visit(`${MAINAPP_URL.VANILLA}`)
    cy.wait(3000)
  })

  it('should preload right', () => {
    cy.window().then((item) => {
      expect(item.app.template).to.be.a('string')
    })
  })

  it('should mount successfully', () => {
    cy.get('[data-testid="btn"]').first().click()
    cy.wait(1000)
    isSymbolExist()
  })
})
