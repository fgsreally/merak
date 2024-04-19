import fs from 'fs'
import { resolve } from 'path'
import { describe, expect, it } from 'vitest'
import { analyseJSGlobals, analysePathInHTML, compileStatement, injectGlobalToESM, injectGlobalToIIFE } from '../src'
describe('analyse file', () => {
  it('analyse html file', async () => {
    const content = await fs.promises.readFile(resolve(__dirname, './fixtures/index.html'), 'utf-8')
    const ret = analysePathInHTML(content)
    expect(ret.length).toBe(5)

    function getPath(str: string, start: number, end: number) {
      return str.slice(start, end)
    }
    for (const { loc: [start, end] } of ret)
      expect(getPath(content, start, end)).toMatchSnapshot()
  })

  it('analyese js globals', async () => {
    expect(analyseJSGlobals('const a=document.createElement(\'div\')', [])).toMatchSnapshot()
  })

  it('compile esm js', async () => {
    const filePath = resolve(__dirname, './fixtures/esm.js')
    const { code } = injectGlobalToESM(await fs.promises.readFile(filePath, 'utf-8'), '$test', ['document', 'window'], ['__HMR__'])
    expect(code).toMatchSnapshot()
  })

  it('compile iife js', async () => {
    const filePath = resolve(__dirname, './fixtures/iife.js')
    const { code } = injectGlobalToIIFE(await fs.promises.readFile(filePath, 'utf-8'), '$test', ['document', 'self', 'window'], [])
    expect(code).toMatchSnapshot()
  })

  it('compile statement', () => {
    expect(compileStatement('console.log(window)', 'test')).toMatchSnapshot()
  })
})
