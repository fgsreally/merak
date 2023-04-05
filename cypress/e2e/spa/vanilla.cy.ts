import { MAINAPP_URL } from '../common'

import { getShadowSelector, isSymbolExist } from '../utils'

describe('vanilla app ', () => {
  beforeEach(() => {
    cy.visit(`${MAINAPP_URL.VANILLA}`)
    cy.wait(1000)
  })

  it('should preload right', () => {
    cy.window().then((item) => {
      expect(item.app.template).to.be.a('string')
    })
  })
  it('should prerender', () => {
    cy.get(getShadowSelector('vite_react')).should('be.hidden')
  })

  it('should mount successfully', () => {
    cy.get('[data-testid="btn"]').first().click()
    cy.wait(1000)
    isSymbolExist()
  })
})
