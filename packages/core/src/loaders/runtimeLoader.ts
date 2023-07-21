import type { AppConfig, LoadDone } from '../types'
import { resolveUrl } from '../utils'
import { Loader, loadTextFile } from './utils'
export class RuntimeLoader extends Loader {
  re: RegExp[] = [/<script\b.*?(?:\bsrc\s?=\s?([^>]*))?>(.*?)<\/script>/ig, /(?<=<link.*href=")([^"]*)(?=")/g]

  async load(sourceUrl: string, configOrUrl?: string | AppConfig) {
    if (this.loadCache.has(sourceUrl))
      return this.loadCache.get(sourceUrl)
    try {
      let config = {} as unknown as AppConfig
      let htmlStr = await loadTextFile(sourceUrl)

      if (configOrUrl) { // independent config file
        config = typeof configOrUrl === 'string' ? (await this.loadJSON(configOrUrl)) : configOrUrl
      }
      else { // inline config
        config = this.resolveHtml(htmlStr).config as any
      }
      function replaceSrc(str: string, re: RegExp) {
        return str.replace(re, (_, url) => resolveUrl(url, sourceUrl))
      }

      for (const re of this.re)
        htmlStr = replaceSrc(htmlStr, re)

      const loadRes = { url: sourceUrl, fakeGlobalVar: config._f, template: htmlStr, nativeVars: config._n, customVars: config._c } as LoadDone
      this.loadCache.set(sourceUrl, loadRes)
      return loadRes
    }
    catch (e) {
      return e
    }
  }
}
