import type { ImportScript, MerakHTMLFile } from 'merak-compile'
import type MagicString from 'magic-string'
import MS from '../magic-string'
import { compileCSSLink, compileHTMLJS } from '../compile'
import type { LoadDone, LoaderHookParam, MerakConfig, MerakPlugin } from '../types'

import { loadJSONFile, loadTextFile, resolveUrl } from '../utils'

export async function loadConfig(url: string) {
  return await loadJSONFile(resolveUrl('merak.json', url))
}

export class PureLoader {
  public loadCache: Map<string, LoadDone> = new Map()
  constructor(public plugins: MerakPlugin<PureLoader>[] = [],
  ) {
    this.execHook('init', this as any)
  }

  async execHook(hook: keyof MerakPlugin<PureLoader>, param?: LoaderHookParam) {
    for (const plugin of this.plugins)
      await plugin[hook]?.(param as any)

    return param
  }

  async load(id: string, url: string, configUrl?: string) {
    if (this.loadCache.has(id))
      return this.loadCache.get(id)

    let config = {} as unknown as MerakConfig
    let fileURL: string
    let htmlStr: string
    if (configUrl) { // independent config file
      config = await loadConfig(configUrl || url)
      fileURL = resolveUrl(config._t._f, url)
      htmlStr = await loadTextFile(fileURL)
    }
    else { // inline config
      fileURL = resolveUrl('index.html', url)
      htmlStr = await loadTextFile(url)
      htmlStr = htmlStr.replace(/<merak-base[^>]+config=['"](.*)['"][\s>]<\/merak-base>/, (js, conf) => {
        config = JSON.parse(conf)
        return ''
      })
    }
    const htmlInfo = config._t
    const { code } = await this.execHook('transform', { cmd: 'transform', code: htmlStr, id }) as any

    htmlInfo._s.forEach((item) => {
      if ((item as ImportScript)._f)
        (item as ImportScript)._f = resolveUrl((item as ImportScript)._f, url) as string
    })

    const template = this.compileHTML(code, htmlInfo, url, config._g, config._f)

    const loadRes = { cmd: 'load' as const, id, url, fakeGlobalName: config._f, template, scripts: htmlInfo._s.map(item => item._a) as Record<string, any>[] }

    await this.execHook('load', loadRes)

    this.loadCache.set(id, loadRes)
    return loadRes
  }

  compileHTML(code: string, file: MerakHTMLFile, baseURL: string, globals: string[], fakeGlobalName: string) {
    const s = new MS(code) as unknown as MagicString
    compileCSSLink(s, file._l, baseURL)
    compileHTMLJS(s, baseURL, file._s, globals, fakeGlobalName)
    return s.toString()
  }
}
