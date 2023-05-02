import { resolveHtmlConfig } from 'merak-compile'
import type { LoadDone, MerakConfig } from '../types'
import { loadTextFile, resolveUrl } from '../utils'
import { Loader } from './base'
import { loadConfig } from './pureLoader'
const scriptRE = /<script\b.*?(?:\bsrc\s?=\s?([^>]*))?>(.*?)<\/script>/ig
const linkRE = /(?<=<link.*href=")([^"]*)(?=")/g

export class DynamicLoader extends Loader {
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
        config = resolveHtmlConfig(htmlStr).config
      }
      function replaceSrc(str: string, re: RegExp) {
        return str.replace(re, (_, url) => resolveUrl(url, sourceUrl))
      }

      htmlStr = replaceSrc(htmlStr, scriptRE)
      htmlStr = replaceSrc(htmlStr, linkRE)

      const loadRes = { url: sourceUrl, fakeGlobalVar: config._f, template: htmlStr, globals: config._g } as LoadDone
      this.loadCache.set(sourceUrl, loadRes)
      return loadRes
    }
    catch (e) {
      return e
    }
  }
}
