import type { AppConfig, LoadDone } from '../types'
import { Loader, compileHTML, loadTextFile } from './utils'

export class CompileLoader extends Loader {
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
        const ret = this.resolveHtml(htmlStr, sourceUrl)
        htmlStr = ret.html
        config = ret.config as unknown as AppConfig
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
