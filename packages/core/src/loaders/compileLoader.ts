import type { CompileInfo, LoadDone } from '../types'
import { Loader, loadTextFile, resolvePathInHTML } from './utils'

export class CompileLoader extends Loader {
  async load(sourceUrl: string, configOrUrl?: string | CompileInfo) {
    if (this.loadCache.has(sourceUrl))
      return this.loadCache.get(sourceUrl)
    try {
      let config = {} as unknown as CompileInfo
      let htmlStr = await loadTextFile(sourceUrl)

      if (configOrUrl) { // independent config file
        config = typeof configOrUrl === 'string' ? (await this.loadJSON(configOrUrl)) : configOrUrl
      }
      else { // inline config
        const ret = this.resolveHtml(htmlStr)
        htmlStr = ret.html
        config = ret.config as unknown as CompileInfo
      }
      const template = resolvePathInHTML(htmlStr, sourceUrl, config.l as [number, number][])
      const loadRes = { url: sourceUrl, projectGlobalVar: config.p, template, nativeVars: config.n, customVars: config.c } as LoadDone
      this.loadCache.set(sourceUrl, loadRes)
      return loadRes
    }
    catch (e) {
      return e
    }
  }
}
