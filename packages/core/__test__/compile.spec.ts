import fs from 'fs'
import { resolve } from 'path'
import { describe, expect, it } from 'vitest'
import { analyseHTML } from 'merak-compile'
import { compileHTML } from '../src/compile'
describe('analyse file', () => {
  it('compileInlineJS', async () => {
    const content = await fs.promises.readFile(resolve(__dirname, './fixtures/index.html'), 'utf-8')
    const ret = analyseHTML(content)
    expect(compileHTML(content, 'http://localhost:5002', ret._l)).toMatchSnapshot()
  })

  // it('compile esm js', async () => {
  //   const filePath = resolve(__dirname, './fixtures/esm.js')
  //   const { code } = injectGlobalToESM(await fs.promises.readFile(filePath, 'utf-8'), '$test', ['document', 'window'])
  //   expect(code).toMatchSnapshot()
  // })
})
