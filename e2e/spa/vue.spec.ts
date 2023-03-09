import { beforeAll, describe, expect, it } from 'vitest'
import type { Page } from 'puppeteer'
import { SUBAPP_KEY } from '../common'
import { clickDom, createPage, getDomText, sleep } from '../utils'
let newPage: Page

describe('vue spa main', () => {
  beforeAll(async () => {
    newPage = await createPage()
  })
  it('should find the text from sub app', async () => {
    await newPage.goto('http://localhost:5003/about')
    await sleep()
    expect(await getDomText(newPage, '#vite_vue #merak-symbol')).toBe(SUBAPP_KEY.VITE_VUE)
    expect(await getDomText(newPage, '#vite_react #merak-symbol')).toBe(SUBAPP_KEY.VITE_REACT)
    expect(await getDomText(newPage, '#vue_cli #merak-symbol')).toBe(SUBAPP_KEY.VUE_CLI)
  })

  it('route in sub should work', async () => {
    await clickDom(newPage, '')
    expect(await getDomText(newPage, '#vite_vue #merak-symbol')).toBe(SUBAPP_KEY.VITE_VUE)

    await clickDom(newPage, '')
    await clickDom(newPage, '')

    expect(await getDomText(newPage, '#vite_react #merak-symbol')).toBe(SUBAPP_KEY.VITE_REACT)
    expect(await getDomText(newPage, '#vue_cli #merak-symbol')).toBe(SUBAPP_KEY.VUE_CLI)
  })
  it('should find the text as before', async () => {
    await clickDom(newPage, '')
    await clickDom(newPage, '')
    await sleep()
    expect(await getDomText(newPage, '#vite_vue #merak-symbol')).toBe(SUBAPP_KEY.VITE_VUE)
    expect(await getDomText(newPage, '#vite_react #merak-symbol')).toBe(SUBAPP_KEY.VITE_REACT)
    expect(await getDomText(newPage, '#vue_cli #merak-symbol')).toBe(SUBAPP_KEY.VUE_CLI)
  })
})
