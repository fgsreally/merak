import { compileHTML } from '../compile'
import type { JsonLoaderOpts, LoadDone } from '../types'

import { Loader, loadJSONFile, loadTextFile } from './utils'

export class JsonLoader extends Loader {
  loadJSON(url: string) {
    return loadJSONFile(url)
  }

  resolveHtml(html: string) {
    let config
    // <m-b> merak-base
    html = html.replace(/<m-b>(.*)<\/m-b>/, (js, base) => {
      config = JSON.parse(base)
      return ''
    })
    return { html, config }
  }

  async load(sourceUrl: string, optsOrUrl?: string | JsonLoaderOpts) {
    if (this.loadCache.has(sourceUrl))
      return this.loadCache.get(sourceUrl)
    try {
      let config = {} as unknown as JsonLoaderOpts
      let htmlStr = await loadTextFile(sourceUrl)

      if (optsOrUrl) { // independent config file
        config = typeof optsOrUrl === 'string' ? (await this.loadJSON(optsOrUrl)) : optsOrUrl
      }
      else { // inline config
        const ret = this.resolveHtml(htmlStr)
        htmlStr = ret.html
        config = ret.config as unknown as JsonLoaderOpts
      }
      const template = compileHTML(htmlStr, sourceUrl, config._l as [number, number][])
      const loadRes = { url: sourceUrl, fakeGlobalVar: config._f, template, nativeVars: config._n, customVars: config._c } as LoadDone
      this.loadCache.set(sourceUrl, loadRes)
      return loadRes
    }
    catch (e) {
      return e
    }
  }
}
