import { describe, expect, it } from 'vitest'
import { Compiler } from '../src/compiler'
import esm from './fixtures/esm.js?raw'
import webpackEval from './fixtures/webpack-eval.js?raw'
import style from './fixtures/style.css?raw'
import html from './fixtures/index.html?raw'
import { removeMerakTag } from './utils'

describe('compiler', () => {
  const compiler = new Compiler('test', ['window', 'document'], ['__HMR__'])

  it('compile esm js', async () => {
    const { code } = compiler.compileESM(esm, 'esm.js')
    expect(code).toMatchSnapshot()
  })

  it('compile script', async () => {
    const { code } = compiler.compileScript(webpackEval, 'webpack-eval.js')
    expect(code).toMatchSnapshot()
  })

  it('compile js statement', async () => {
    const { code } = compiler.compileStatement('console.log(a)')
    expect(code).toMatchSnapshot()
  })

  it('compile style', async () => {
    const { code } = compiler.compileStyle(style, 'style.css')
    expect(code).toMatchSnapshot()
  })

  it('compile html', async () => {
    const { code } = compiler.compileHTML(html, 'index.html')
    expect(removeMerakTag(code)).toMatchSnapshot()
  })

  // it('compile iife js', async () => {
  //   const filePath = resolve(__dirname, './fixtures/iife.js')
  //   const { code } = injectGlobalToIIFE(await fs.promises.readFile(filePath, 'utf-8'), '$test', ['document', 'self', 'window'], [])
  //   expect(code).toMatchSnapshot()
  // })

  // it('compile statement', () => {
  //   expect(compileStatement('console.log(window)', 'test')).toMatchSnapshot()
  // })
})
