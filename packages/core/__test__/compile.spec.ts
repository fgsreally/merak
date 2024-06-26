import fs from 'fs'
import { resolve } from 'path'
import { describe, expect, it } from 'vitest'
import { getPathLocFromHTML } from 'merak-compile'
import { resolvePathInHTML } from '../src/loaders/utils'
import { RuntimeLoader } from '../src/loaders'

const content = fs.readFileSync(resolve(__dirname, './fixtures/index.html'), 'utf-8')

describe('analyse html', () => {
  it('handle tags and import', async () => {
    const ret = getPathLocFromHTML(content)
    expect(resolvePathInHTML(content, 'http://localhost:5002/base/index.html', ret)).toMatchSnapshot()
    expect(resolvePathInHTML(content, 'http://localhost:5002', ret)).toMatchSnapshot()
  })

  it('handle url in inline style', async () => {
    const loader = new RuntimeLoader()
    expect(loader.resolveHtml(content, 'http://localhost:5002/base/index.html').html).toMatchSnapshot()
    expect(loader.resolveHtml(content, 'http://localhost:5002').html).toMatchSnapshot()
  })
})
