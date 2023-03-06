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
      fileURL = resolveUrl(config.template.filePath, url)
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
    const htmlInfo = config.template

    const { code } = await this.execHook('transform', { cmd: 'transform', code: htmlStr, id }) as any

    htmlInfo.scripts.forEach((item) => {
      if ((item as ImportScript).filePath)
        (item as ImportScript).filePath = resolveUrl((item as ImportScript).filePath, url) as string
    })

    const template = this.compileHTML(code, htmlInfo, url, config.globals, config.fakeGlobalName)

    const loadRes = { cmd: 'load' as const, id, url, fakeGlobalName: config.fakeGlobalName, template, scripts: htmlInfo.scripts.map(item => item.merakAttrs) as Record<string, any>[] }

    await this.execHook('load', loadRes)

    this.loadCache.set(id, loadRes)
    return loadRes
  }

  compileHTML(code: string, file: MerakHTMLFile, baseURL: string, globals: string[], fakeGlobalName: string) {
    const s = new MS(code) as unknown as MagicString
    compileCSSLink(s, file.links, baseURL)
    compileHTMLJS(s, file.scripts, globals, fakeGlobalName)
    return s.toString()
  }
}
