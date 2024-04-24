import type { CompileInfo, LoadDone } from '../types'
import { Loader } from './utils'
export class SSRLoader extends Loader {
  async load(sourceUrl: string, LoaderOpts?: string | CompileInfo) {
    if (this.loadCache.has(sourceUrl))
      return this.loadCache.get(sourceUrl)
    try {
      let config = {} as unknown as CompileInfo
      let htmlStr: string
      const templateNode = document.querySelector(`[data-merak-url='${sourceUrl}']`)
      if (LoaderOpts) { // independent config file
        config = typeof LoaderOpts === 'string' ? (await this.loadJSON(LoaderOpts)) : LoaderOpts
        htmlStr = templateNode!.innerHTML
      }
      else { // inline config
        const ret = this.resolveHtml(templateNode!.innerHTML!)
        htmlStr = ret.html
        config = ret.config as unknown as CompileInfo
      }
      const loadRes = { url: sourceUrl, projectGlobalVar: config.p, template: htmlStr, nativeVars: config.n, customVars: config.c } as LoadDone
      this.loadCache.set(sourceUrl, loadRes)
      return loadRes
    }
    catch (e) {
      return e
    }
  }
}
