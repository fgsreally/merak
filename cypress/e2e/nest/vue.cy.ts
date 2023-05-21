import { MAINAPP_URL } from '../common'
import { isSymbolExist } from '../utils'
describe('nest app ', () => {
  beforeEach(() => {
    cy.visit(`${MAINAPP_URL.NEST}`)
  })
  it('should work', () => {
    isSymbolExist(['main_vue'])
  })
})
