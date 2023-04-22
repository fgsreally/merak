import { compileHTML } from '../compile'
import type { LoadDone, MerakConfig } from '../types'

import { loadJSONFile, loadTextFile, resolveHtmlConfig, resolveUrl } from '../utils'

export async function loadConfig(url: string) {
  return await loadJSONFile(resolveUrl('merak.json', url))
}

export class PureLoader {
  public loadCache: Map<string, LoadDone> = new Map()

  async load(id: string, url: string, configUrl?: string) {
    if (this.loadCache.has(id))
      return this.loadCache.get(id)
    try {
      let config = {} as unknown as MerakConfig
      let htmlStr: string
      if (configUrl) { // independent config file
        config = await loadConfig(configUrl || url)
        htmlStr = await loadTextFile(url)
      }
      else { // inline config
        htmlStr = await loadTextFile(url)

        const ret = resolveHtmlConfig(htmlStr)
        htmlStr = ret.html
        config = ret.config as unknown as MerakConfig
      }

      const template = compileHTML(htmlStr, url, config._l)

      const loadRes = { id, url, fakeGlobalVar: config._f, template, globals: config._g } as LoadDone

      this.loadCache.set(id, loadRes)
      return loadRes
    }
    catch (e) {
      return e
    }
  }
}
