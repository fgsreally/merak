import type { AppConfig, LoadDone } from '../types'
import { Loader } from './utils'
export class SSRLoader extends Loader {
  async load(url: string, LoaderOpts?: string | AppConfig) {
    if (this.loadCache.has(url))
      return this.loadCache.get(url)
    try {
      let config = {} as unknown as AppConfig
      let htmlStr: string
      const templateNode = document.querySelector(`[data-merak-url='${url}']`)

      if (LoaderOpts) { // independent config file
        config = typeof LoaderOpts === 'string' ? (await this.loadJSON(LoaderOpts)) : LoaderOpts
        htmlStr = templateNode!.innerHTML
      }
      else { // inline config
        const ret = this.resolveHtml(templateNode!.innerHTML!)
        htmlStr = ret.html
        config = ret.config as unknown as AppConfig
      }
      const loadRes = { url, fakeGlobalVar: config._f, template: htmlStr, nativeVars: config._n, customVars: config._c } as LoadDone
      this.loadCache.set(url, loadRes)
      return loadRes
    }
    catch (e) {
      return e
    }
  }
}
