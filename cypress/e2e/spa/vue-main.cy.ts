import type Sinon from 'cypress/types/sinon'
import { MAINAPP_URL } from '../common'

import { isSymbolExist, visit } from '../utils'

describe('main vue app', () => {
  beforeEach(() => {
    visit(`${MAINAPP_URL.VUE}`)

    cy.wait(2000)

    cy.get('a[href=\'/about\']').click()
  })
  it('should work', () => {
    isSymbolExist(['vite_react', 'vue_cli', 'vite_vue'])
    expectLog([

      'beforeunmount',
      'afterunmount', // work for preload
      'beforemount',
      'aftermount',
    ])
  })

  // @todo it will throw error only in cypress mode
  // it('sub app should hidden and relunch/mount', () => {
  //   cy.get('a[href=\'/\']').click()
  //   expectLog([
  //     'beforeunmount',
  //     'afterunmount',
  //     'beforemount',
  //     'aftermount',
  //     'beforeunmount',
  //     'afterunmount',
  //   ])

  //   cy.get('a[href=\'/about\']').click()
  //   cy.wait(1000)
  //   isSymbolExist(['vite_vue', 'vite_react', 'vue_cli'])
  // })
})

function expectLog(info: string[]) {
  cy.get('@consoleLog').should((_v) => {
    const v = _v as any as Sinon.SinonStub
    const calls = v.args.map(i => i[0]).filter((i: any) => typeof i === 'string' && i.includes('[merak]:')).map((i: string) => i.slice(8))
    expect(calls).to.deep.equal(info)
  })
}
