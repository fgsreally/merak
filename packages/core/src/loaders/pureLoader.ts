import { compileHTML } from '../compile'
import type { LoadDone, LoaderHookParam, MerakConfig, MerakPlugin } from '../types'

import { loadJSONFile, loadTextFile, resolveHtmlConfig, resolveUrl } from '../utils'

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
    const { code } = await this.execHook('transform', { cmd: 'transform', code: htmlStr, id }) as any

    const template = compileHTML(code, url, config._l)

    const loadRes = { cmd: 'load' as const, id, url, fakeGlobalVar: config._f, template, globals: config._g }

    await this.execHook('load', loadRes)

    this.loadCache.set(id, loadRes)
    return loadRes
  }

  // compileHTML(code: string, file: MerakHTMLFile, baseURL: string, globals: string[], fakeGlobalVar: string) {
  //   const s = new MS(code) as unknown as MagicString
  //   compileCSSLink(s, file._l, baseURL)
  //   compileHTMLJS(s, baseURL, file._s, globals, fakeGlobalVar)
  //   return s.toString()
  // }
}
