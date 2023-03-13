import type { Page } from '@playwright/test'
import { SUBAPP_ID } from './common'
export async function getSymbolDom(page: Page) {
  const domSet = {} as any
  for (const id in SUBAPP_ID) {
    const handler = await page.$('merak-app') as any
    domSet[id] = handler.$(`.merak-body.${SUBAPP_ID[id]} .merak-symbol`)
  }
  return domSet
}

export async function clickDom(page: Page, selector: string) {
  const handler = await page.$(selector)
  await handler?.click()
}

export function sleep(time = 1000) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}
