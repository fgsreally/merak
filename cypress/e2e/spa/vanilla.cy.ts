import { MAINAPP_URL } from '../common'

import { isSymbolExist } from '../utils'

describe('vanilla app', () => {
  beforeEach(() => {
    cy.visit(`${MAINAPP_URL.VANILLA}`)
    cy.wait(2000)
  })

  // it('should preload right', () => {
  //   cy.window().then((item) => {
  //     expect(item.app.template).to.be.a('string')
  //   })
  // })

  it('should mount successfully', () => {
    cy.get('[data-testid="btn"]').first().click()
    isSymbolExist(['vite_vue', 'vite_react', 'vue_cli'])
  })
})
