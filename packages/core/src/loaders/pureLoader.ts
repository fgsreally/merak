import { compileHTML } from '../compile'
import type { LoadDone, MerakConfig } from '../types'

import { loadJSONFile, loadTextFile, resolveHtmlConfig, resolveUrl } from '../utils'
import { Loader } from './base'

export async function loadConfig(url: string) {
  return await loadJSONFile(resolveUrl('merak.json', url))
}

export class PureLoader extends Loader {
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
        const ret = resolveHtmlConfig(htmlStr)
        htmlStr = ret.html
        config = ret.config as unknown as MerakConfig
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
