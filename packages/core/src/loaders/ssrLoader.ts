import type { LoadDone, MerakConfig } from '../types'
import { resolveHtmlConfig } from '../utils'
import { loadConfig } from './pureLoader'
import { Loader } from './base'
export class SSRLoader extends Loader {
  async load(url: string, configOrUrl?: string | MerakConfig) {
    if (this.loadCache.has(url))
      return this.loadCache.get(url)
    try {
      let config = {} as unknown as MerakConfig
      let htmlStr: string
      const templateNode = document.querySelector(`[data-merak-url='${url}']`)

      if (configOrUrl) { // independent config file
        config = typeof configOrUrl === 'string' ? (await loadConfig(configOrUrl)) : configOrUrl
        htmlStr = templateNode!.innerHTML
      }
      else { // inline config
        const ret = resolveHtmlConfig(templateNode!.innerHTML!)
        htmlStr = ret.html
        config = ret.config as unknown as MerakConfig
      }

      const loadRes = { url, fakeGlobalVar: config._f, template: htmlStr, globals: config._g } as LoadDone
      this.loadCache.set(url, loadRes)
      return loadRes
    }
    catch (e) {
      return e
    }
  }
}
