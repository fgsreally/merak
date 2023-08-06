import fs from 'fs'
import { resolve } from 'path'
import { describe, expect, it } from 'vitest'
import { analyseHTML } from 'merak-compile'
import { compileHTML } from '../src/loaders/utils'
describe('analyse file', () => {
  it('compileHTML', async () => {
    const content = await fs.promises.readFile(resolve(__dirname, './fixtures/index.html'), 'utf-8')
    const ret = analyseHTML(content)
    expect(compileHTML(content, 'http://localhost:5002/base/index.html', ret.map(item => item.loc))).toMatchSnapshot()
  })
})
