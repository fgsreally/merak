import { MAINAPP_URL } from '../common'

import { getShadowSelector } from '../utils'

const selector = getShadowSelector('vue_lib')

describe('lib app [dev mode]', () => {
  beforeEach(() => {
    cy.visit(`${MAINAPP_URL.VUE_LIB}`)
  })

  it('merak should mount', () => {
    cy.get(selector).should('exist')
  })
  it('modal should mount to the shadow', () => {
    cy.get(selector).shadow().find('button').click()
    cy.get(selector).shadow().find('.modal').click().should('exist')
  })
})
