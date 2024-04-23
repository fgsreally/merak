/* eslint-disable promise/param-names */
import fs from 'fs'
import { resolve } from 'path'
import { Writable } from 'node:stream'
import { describe, expect, it } from 'vitest'
import { Compiler, SsrTransformer, mergeCompiledHTML } from '../src'
import html from './fixtures/index.html?raw'

describe('ssr', () => {
  const app1 = 'https://localhost:3000/app1/index.html'
  const app2 = 'https://localhost:3000/app2/index.html'

  const compiler1 = new Compiler('app1', ['window', 'document'], [])
  const compiler2 = new Compiler('app2', ['window', 'document'], [])

  it('basic', async () => {
    expect(mergeCompiledHTML(compiler1.compileHTML(html, 'index.html').code, compiler2.compileHTML(html, 'index.html').code, app2, { attrs: { class: 'test' } }),
    ).toMatchSnapshot()
  })

  it('stream', () => new Promise<void>((done) => {
    const mainStream = fs.createReadStream(resolve(__dirname, './fixtures/index.html'))
    const subStream = fs.createReadStream(resolve(__dirname, './fixtures/index.html'))

    const transfomer = new SsrTransformer(app1)

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
