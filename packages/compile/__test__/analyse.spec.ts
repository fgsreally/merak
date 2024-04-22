import { describe, expect, it } from 'vitest'
import { getImportLocFromJS, getPathLocFromHTML, getUrlLocFromCSS } from '../src'
import html from './fixtures/index.html?raw'
describe('analyse file', () => {
  it('getImportLocFromJS', () => {
    const script = `
    import {a} from './a'
    import {b} from "./b"
    import x from "x"

    const c=import('./c')
    `
    const loc = getImportLocFromJS(script)
    expect(loc.map(([start, end]) => {
      return script.slice(start, end)
    })).toEqual(['./a', './b', './c'])
  })

  it('getUrlLocFromCSS', () => {
    const style = `
@import url('./a');
@import 'b';

.a{
  background-image:url('./c')
}
    `
    const loc = getUrlLocFromCSS(style)
    expect(loc.map(([start, end]) => {
      return style.slice(start, end)
    })).toEqual(['./c', './a', 'b'])
  })

  it('getPathLocFromHTML', () => {
    const loc = getPathLocFromHTML(html)
    expect(loc.map(([start, end]) => {
      return html.slice(start, end)
    })).toEqual(['/favicon.ico', 'a.js', 'a.css', 'b.css', 'a.png', './b.js', './c.js'])
  })
})
