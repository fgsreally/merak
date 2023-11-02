import { MAINAPP_URL } from '../common'

import { getShadowSelector } from '../utils'

const selector = getShadowSelector('UUID')

describe('lib app ', () => {
  before(() => {
    cy.visit(`${MAINAPP_URL.VUE_LIB}`)
    cy.interceptConsoleLog()

    cy.wait(3000)
  })

  it('merak should mount', () => {
    cy.get('#test').click()
    cy.get(selector).should('exist')
    //  cy.verifyConsoleLogOrder(['beforemount','aftermount',])

  //  cy.verifyConsoleLogOrder(['beforemount','aftermount',])
  })
})
