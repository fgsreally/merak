import type { LoadDone } from '../types'
import { resolveUrl } from '../utils'
export abstract class Loader {
  protected loadCache: Map<string, LoadDone> = new Map()
  abstract load(sourceUrl: string, LoaderOpts?: any): Promise<LoadDone | any>
  loadJSON(url: string) {
    return loadJSONFile(url)
  }

  resolveHtml(html: string, baseUrl: string) {
    let config: any
    // <m-b> merak-base

    html = html.replace(/<m-b[^>]+config=['"](.*)['"][\s>]<\/m-b>/, (js, conf) => {
      config = JSON.parse(decodeURIComponent(conf))
      return ''
    })

    // replace url in inline style
    html = html.replace(/<style([^>]*)>([\s\S]*?)<\/style>/g, (style) => {
      return style.replace(/url\(['"]?(.*?)['"]?\)/g, (_, url) => {
        return `url('${resolveUrl(url, baseUrl)}')`
      })
    })
    return { html, config }
  }
}

export async function loadJSONFile(url: string) {
  const res = await fetch(url)
  return res.json()
}
export async function loadTextFile(url: string) {
  const res = await fetch(url)
  return res.text()
}

export function compileHTML(code: string, htmlUrl: string, loc: [number, number][]) {
  const originStr = code
  let index = 0
  code = ''
  loc.forEach(([start, end]) => {
    code += originStr.slice(index, start)
    code += resolveUrl(originStr.slice(start, end), htmlUrl)
    index = end
  })
  code += originStr.slice(index)
  return code
}
