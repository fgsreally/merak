import fs from 'fs'
import { resolve } from 'path'
import puppeteer from 'puppeteer'
import type { Page } from 'puppeteer'
export async function createPage() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  return page
}

export async function awaitConsoleLogMessage(page: Page, message: string): Promise<void> {
  await new Promise<void>((resolve) => {
    page.on('console', (msg) => {
      // 完成渲染
      msg.text() === message && resolve()
    })
  })
}
export function sleep(ms = 2000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function getDomText(page: Page, selector: string) {
  return await page.$eval(selector, el => (el as any).innerText)
}

export async function isDomExist(page: Page, selector: string) {
  return await page.$eval(selector, el => !!el)
}

export async function clickDom(page: Page, selector: string) {
  return await page.$eval(selector, el => (el as any).click())
}
