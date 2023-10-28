import type { AppConfig, LoadDone } from '../types'
import { Loader } from './utils'
export class SSRLoader extends Loader {
  async load(sourceUrl: string, LoaderOpts?: string | AppConfig) {
    if (this.loadCache.has(sourceUrl))
      return this.loadCache.get(sourceUrl)
    try {
      let config = {} as unknown as AppConfig
      let htmlStr: string
      const templateNode = document.querySelector(`[data-merak-url='${sourceUrl}']`)

      if (LoaderOpts) { // independent config file
        config = typeof LoaderOpts === 'string' ? (await this.loadJSON(LoaderOpts)) : LoaderOpts
        htmlStr = templateNode!.innerHTML
      }
      else { // inline config
        const ret = this.resolveHtml(templateNode!.innerHTML!, sourceUrl)
        htmlStr = ret.html
        config = ret.config as unknown as AppConfig
      }
      const loadRes = { url: sourceUrl, fakeGlobalVar: config._f, template: htmlStr, nativeVars: config._n, customVars: config._c } as LoadDone
      this.loadCache.set(sourceUrl, loadRes)
      return loadRes
    }
    catch (e) {
      return e
    }
  }
}
