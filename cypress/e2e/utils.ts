import { SUBAPP_CONTENT } from './common'

export function getShadowSelector(id: string) {
  return `[data-merak-id="${id}"]`
}

export function getModalBtn() {
  return '[data-testid="modal-btn"]'
}

export function getModal() {
  return '[data-testid="modal-content"]'
}

export function isSymbolExist(ids: (keyof typeof SUBAPP_CONTENT)[]) {
  ids.forEach((id) => {
    cy.get(getShadowSelector(id as string)).shadow().find('.merak-symbol').contains(SUBAPP_CONTENT[id])
  })
}

// export function checkModalColor() {
//   for (const id of SUBAPP_NAME) {
//     cy.get(getShadowSelector(id)).shadow().find('a[href=\'/about\']').click({ force: true })
//     cy.get(getShadowSelector(id)).shadow().find(getModalBtn()).click({ force: true })
//     cy.get(getShadowSelector(id)).shadow().find(getModal()).should('have.css', 'background-color', SUBAPP_BG_STYLE[id])
//   }
// }
