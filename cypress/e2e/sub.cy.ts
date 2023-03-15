import { SUBAPP_URL } from './common'

describe('sub app [dev mode]', () => {
  it('should work', async () => {
    for (const id in SUBAPP_URL) {
      cy.visit(SUBAPP_URL[id])
      cy.get('.merak-symbol').should('exist')
    }
  })
})
