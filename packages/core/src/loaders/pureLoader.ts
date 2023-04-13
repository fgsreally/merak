import { compileHTML } from '../compile'
import type { LoadDone, LoaderHookParam, LoaderPlugin, MerakConfig } from '../types'

import { loadJSONFile, loadTextFile, resolveHtmlConfig, resolveUrl } from '../utils'

export async function loadConfig(url: string) {
  return await loadJSONFile(resolveUrl('merak.json', url))
}

export class PureLoader {
  public loadCache: Map<string, LoadDone> = new Map()

  constructor(public plugins?: LoaderPlugin<PureLoader>,
  ) {
    this.execHook('init', this as any)
  }

  execHook(hook: keyof LoaderPlugin<PureLoader>, param?: LoaderHookParam) {
    return this.plugins?.[hook]?.(param as any) || param
  }

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
      const { code } = await this.execHook('transform', { cmd: 'transform', code: htmlStr, id }) as any

      const template = compileHTML(code, url, config._l)

      const loadRes = { cmd: 'load' as const, id, url, fakeGlobalVar: config._f, template, globals: config._g } as LoadDone

      await this.execHook('load', loadRes)

      this.loadCache.set(id, loadRes)
      return loadRes
    }
    catch (e) {
      return this.execHook('errorHandler', { cmd: 'error', e } as any)
    }
  }
}
