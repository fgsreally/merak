/* eslint-disable promise/param-names */
import fs from 'fs'
import { resolve } from 'path'
import { Writable } from 'node:stream'
import { describe, expect, it } from 'vitest'
import { SsrTransformer, addMerakTagToHtml } from '../src'
describe('ssr', () => {
  const subUrl = 'https://localhost:3000/app/index.html'

  it('basic', async () => {
    const content = await fs.promises.readFile(resolve(__dirname, './fixtures/index.html'), 'utf-8')
    expect(addMerakTagToHtml(content, content, subUrl, { attrs: { class: 'test' } }),
    ).toMatchSnapshot()
  })

  it('stream', () => new Promise<void>((done) => {
    const mainStream = fs.createReadStream(resolve(__dirname, './fixtures/index.html'))
    const subStream = fs.createReadStream(resolve(__dirname, './fixtures/index.html'))

    const transfomer = new SsrTransformer(subUrl)

    const mockHttpStream = new Writable()

    let data = ''
    mockHttpStream._write = (chunk, encoding, callback) => {
      data += chunk.toString()
      callback()
    }

    transfomer.on('end', () => {
      expect(data).toMatchSnapshot()
      done()
    })

    mainStream.on('end', () => {
      transfomer.pipe(mockHttpStream)
    })

    mainStream.pipe(mockHttpStream, { end: false })
    subStream.pipe(transfomer)
  }))
})
