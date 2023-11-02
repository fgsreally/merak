/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare namespace Cypress {
  interface Chainable {
    /**
       * Intercept console.log and store it as an alias for further assertions.
       */
    interceptConsoleLog(): Chainable<any>

    /**
       * Verify the order of console.log outputs.
       * @param expectedOrder - An array of strings representing the expected order of console.log outputs.
       */
    verifyConsoleLogOrder(expectedOrder: string[]): Chainable<any>
  }
}

Cypress.Commands.add('interceptConsoleLog', () => {
  cy.window().then((win) => {
    cy.stub(win.console, 'log').as('consoleLog')
  })
})

Cypress.Commands.add('verifyConsoleLogOrder', (expectedOrder: string[]) => {
  cy.get('@consoleLog').then((consoleLog: any) => {
    const logs = consoleLog.args.map((args: any) => args[0])
    const actualOrder = logs.filter((log: any) => expectedOrder.includes(log))

    expect(actualOrder).to.deep.equal(expectedOrder)
  })
})
