import fs from 'fs'
import { resolve } from 'path'
import { describe, expect, it } from 'vitest'
import { analyseHTML, injectGlobalToESM, injectGlobalToIIFE } from '../src'
describe('analyse file', () => {
  it('analyse html file', async () => {
    const content = await fs.promises.readFile(resolve(__dirname, './fixtures/index.html'), 'utf-8')
    const ret = analyseHTML(content)
    expect(ret._l.length).toBe(5)

    function getPath(str: string, start: number, end: number) {
      console.log(str.slice(start, end))
      return str.slice(start, end)
    }
    for (const [start, end] of ret._l)
      expect(getPath(content, start, end)).toMatchSnapshot()
  })

  // it('compile esm js', async () => {
  //   const filePath = resolve(__dirname, './fixtures/esm.js')
  //   const { code } = injectGlobalToESM(await fs.promises.readFile(filePath, 'utf-8'), '$test', ['document', 'window'])
  //   expect(code).toMatchSnapshot()
  // })

  it('compile iife js', async () => {
    const filePath = resolve(__dirname, './fixtures/iife.js')
    const { code } = injectGlobalToIIFE(await fs.promises.readFile(filePath, 'utf-8'), '$test', ['document', 'self', 'window'])
    expect(code).toMatchSnapshot()
  })
})
