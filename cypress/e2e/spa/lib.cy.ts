import { MAINAPP_URL } from '../common'

import { getShadowSelector } from '../utils'

const selector = getShadowSelector('UUID')

describe('lib app ', () => {
  beforeEach(() => {
    cy.visit(`${MAINAPP_URL.VUE_LIB}`)
    cy.wait(3000)
  })

  it('merak should mount', () => {
    cy.get('button').click()
    cy.get(selector).should('exist')
  })
})
