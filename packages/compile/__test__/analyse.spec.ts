import fs from 'fs'
import { resolve } from 'path'
import { describe, expect, it } from 'vitest'
import { analyseHTML, analyseJS, injectGlobalToESM, injectGlobalToIIFE } from '../src'
describe('analyse file', () => {
  it('analyse html file', async () => {
    const ret = analyseHTML(await fs.promises.readFile(resolve(__dirname, './fixtures/index.html'), 'utf-8'))
    expect(ret).toMatchSnapshot()
  })

  it('analyse js file', async () => {
    const filePath = resolve(__dirname, './fixtures/index.js')
    const ret = analyseJS(await fs.promises.readFile(filePath, 'utf-8'), filePath, __dirname, ['document'])
    expect(ret).toMatchSnapshot()
  })

  it('compile esm js', async () => {
    const filePath = resolve(__dirname, './fixtures/index.js')
    const ret = injectGlobalToESM(await fs.promises.readFile(filePath, 'utf-8'), '$test', ['document'])
    expect(ret).toMatchSnapshot()
  })

  it('compile esm js', async () => {
    const filePath = resolve(__dirname, './fixtures/index.js')
    const ret = injectGlobalToIIFE(await fs.promises.readFile(filePath, 'utf-8'), '$test', ['document'])
    expect(ret).toMatchSnapshot()
  })
})
