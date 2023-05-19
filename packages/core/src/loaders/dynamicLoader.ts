import { loadTextFile, resolveHtmlConfig, resolveUrl } from '../utils'
import type { LoadDone, MerakConfig } from '../types'
import { Loader } from './base'
import { loadConfig } from './pureLoader'

export class DynamicLoader extends Loader {
  re: RegExp[] = [/<script\b.*?(?:\bsrc\s?=\s?([^>]*))?>(.*?)<\/script>/ig, /(?<=<link.*href=")([^"]*)(?=")/g]
  async load(sourceUrl: string, configOrUrl?: string | MerakConfig) {
    if (this.loadCache.has(sourceUrl))
      return this.loadCache.get(sourceUrl)
    try {
      let config = {} as unknown as MerakConfig
      let htmlStr = await loadTextFile(sourceUrl)

      if (configOrUrl) { // independent config file
        config = typeof configOrUrl === 'string' ? (await loadConfig(configOrUrl)) : configOrUrl
      }
      else { // inline config
        config = resolveHtmlConfig(htmlStr).config as any
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
