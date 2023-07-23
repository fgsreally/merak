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

export function isImgExist(id: string, src: string) {
  cy.get(getShadowSelector(id as string)).shadow().find('img').should('have.attr', 'src', src)
}
