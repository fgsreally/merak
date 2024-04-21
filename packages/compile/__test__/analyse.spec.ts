import fs from 'fs'
import { resolve } from 'path'
import { describe, expect, it } from 'vitest'
import { analyseHTML, compileStatement, getImportLocFromJS, getPathLocFromHTML, getUnusedGlobalVariables, getUrlLocFromCSS, injectGlobalToESM, injectGlobalToIIFE } from '../src'
import html from './fixtures/index.html?raw'
describe('analyse file', () => {
  it('getImportLocFromJS', () => {
    const script = `
    import {a} from 'a'
    import {b} from "a"
  
    const x=import('a')
    `
    const loc = getImportLocFromJS(script)
    loc.forEach(([start, end]) => {
      expect(script.slice(start, end)).toBe('a')
    })
  })

  it('getUrlLocFromCSS', () => {
    const style = `
@import url('a')

.a{
  background-image:url('a')
}
    `
    const loc = getUrlLocFromCSS(style)
    expect(loc.map(([start, end]) => {
      return style.slice(start, end)
    })).toEqual(['a', 'a'])
  })

  // it('getPathLocFromHTML', () => {
  //   const loc = getPathLocFromHTML(html)
  //   expect(loc.map(([start, end]) => {
  //     console.log(html.slice(start, end), start, end)
  //     return html.slice(start, end)
  //   })).toEqual(['/assets/index-28fadf32.css', '/src/main.js', './a.css', './a.png', './xx', './esm.js'])
  // })

  // it('analyse html file', async () => {
  //   const content = await fs.promises.readFile(resolve(__dirname, './fixtures/index.html'), 'utf-8')
  //   const ret = analyseHTML(content)
  //   expect(ret.length).toBe(5)

  //   function getPath(str: string, start: number, end: number) {
  //     return str.slice(start, end)
  //   }
  //   for (const { loc: [start, end] } of ret)
  //     expect(getPath(content, start, end)).toMatchSnapshot()
  // })

  // it('analyese js globals', async () => {
  //   expect(getUnusedGlobalVariables('const a=document.createElement(\'div\')', [])).toMatchSnapshot()
  // })

  // it('compile esm js', async () => {
  //   const filePath = resolve(__dirname, './fixtures/esm.js')
  //   const { code } = injectGlobalToESM(await fs.promises.readFile(filePath, 'utf-8'), '$test', ['document', 'window'], ['__HMR__'])
  //   expect(code).toMatchSnapshot()
  // })

  // it('compile iife js', async () => {
  //   const filePath = resolve(__dirname, './fixtures/iife.js')
  //   const { code } = injectGlobalToIIFE(await fs.promises.readFile(filePath, 'utf-8'), '$test', ['document', 'self', 'window'], [])
  //   expect(code).toMatchSnapshot()
  // })

  // it('compile statement', () => {
  //   expect(compileStatement('console.log(window)', 'test')).toMatchSnapshot()
  // })
})
