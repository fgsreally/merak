import { MAINAPP_URL } from '../common'

import { getShadowSelector } from '../utils'

const selector = getShadowSelector('UUID')

describe('lib app [dev mode]', () => {
  beforeEach(() => {
    cy.visit(`${MAINAPP_URL.VUE_LIB}`)
  })

  it('merak should mount', () => {
    cy.get(selector).should('exist')
  })
})
