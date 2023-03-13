import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'
import { MAINAPP_URL, SUBAPP_CONTENT, SUBAPP_URL } from '../common'
import { clickDom, sleep } from '../utils'

async function getSymbol(page: Page) {
  const handlers = []
  for (const id in SUBAPP_CONTENT) {
    const locator = await page.getByText(SUBAPP_CONTENT[id])
    handlers.push(await locator.elementHandle({ timeout: 1000 }).catch(() => null))
  }
  return handlers
}

test.describe('main vue app [dev mode]', () => {
  test('sub app should run successfully', async ({ page }) => {
    for (const id in SUBAPP_URL) {
      await page.goto(SUBAPP_URL[id])
      const handler = await page.$('.merak-symbol')

      expect(handler).toBeDefined()
    }
  })
  test('main app should run successfully', async ({ page }) => {
    await page.goto(MAINAPP_URL.VUE)
    await clickDom(page, '#to_micro')
    const handlers = await getSymbol(page)
    expect(handlers.every(item => !!item)).toBeTruthy()
  })

  test('sub app should hidden and relunch', async ({ page }) => {
    await page.goto(MAINAPP_URL.VUE)

    let handlers: any[]
    await clickDom(page, '#to_micro')
    await clickDom(page, '#to_home')
    handlers = await getSymbol(page)
    expect(handlers.every(item => item === null)).toBeTruthy()

    await clickDom(page, '#to_micro')
    await sleep(5000)
    handlers = await getSymbol(page)
    expect(handlers.every(item => !!item)).toBeTruthy()
  })
})
