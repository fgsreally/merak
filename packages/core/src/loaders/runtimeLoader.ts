import type { CompileInfo, LoadDone } from '../types'
import { resolveUrl } from '../utils'
import { Loader, loadTextFile } from './utils'
export class RuntimeLoader extends Loader {
  re: RegExp[] = [/<script\b.*?(?:\bsrc\s?=\s?([^>]*))?>(.*?)<\/script>/ig, /(?<=<link.*href=")([^"]*)(?=")/g]

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
        config = this.resolveHtml(htmlStr, sourceUrl).config as any
      }
      function replaceSrc(str: string, re: RegExp) {
        return str.replace(re, (_, url) => resolveUrl(url, sourceUrl))
      }

      for (const re of this.re)
        htmlStr = replaceSrc(htmlStr, re)

      const loadRes = { url: sourceUrl, projectGlobalVar: config.p, template: htmlStr, nativeVars: config.n, customVars: config.c } as LoadDone
      this.loadCache.set(sourceUrl, loadRes)
      return loadRes
    }
    catch (e) {
      return e
    }
  }

  // @ts-expect-error override
  override resolveHtml(html: string, baseUrl: string): { html: string; config: any } {
    // replace url in inline style
    html = html.replace(/<style([^>]*)>([\s\S]*?)<\/style>/g, (style) => {
      return style.replace(/url\(['"]?(.*?)['"]?\)/g, (_, url) => {
        return `url('${resolveUrl(url, baseUrl)}')`
      })
    })

    return super.resolveHtml(html)
  }
}
