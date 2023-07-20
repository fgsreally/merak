import { resolve } from 'path'
import { DEFAULT_INJECT_GLOBALS, analyseHTML, analyseJSGlobals, createCustomVarProxy, desctructGlobal, injectGlobalToESM, injectGlobalToIIFE, logger } from 'merak-compile'
import { createFilter } from 'vite'
import type { FilterPattern, PluginOption, ResolvedConfig } from 'vite'
// @ts-expect-error miss types
import isVarName from 'is-var-name'
import { dynamicBase } from 'vite-plugin-dynamic-base'
import { merakCSS } from './lib'
function createFillStr(length: number) {
  let str = ''
  for (let i = 0; i < length; i++)
    str += 'a'

  return str
}

export * from './lib'

export function Merak(fakeGlobalVar: string, opts: { isinLine?: boolean; includes?: FilterPattern; exclude?: FilterPattern; logPath?: string; force?: boolean; nativeVars?: string[]; customVars?: string[];decode?: boolean } = {}): PluginOption {
  if (!isVarName(fakeGlobalVar))
    throw new Error(`${fakeGlobalVar} is not a valid var`)

  // const globalVars = [...new Set(globals)] as string[]
  const { nativeVars = [], customVars = [], includes = /\.(vue|ts|js|tsx|jsx|mjs)/, exclude = /\.(css|scss|sass|less)$/, logPath, force, isinLine = true, decode = false } = opts
  const merakConfig = { _f: fakeGlobalVar, _n: nativeVars, _c: customVars } as any

  nativeVars.push(...DEFAULT_INJECT_GLOBALS)

  const isDebug = !!logPath
  const filter = createFilter(includes, exclude)
  let config: ResolvedConfig
  const publicPath = `(${fakeGlobalVar}.__merak_url__||'')`
  // work in sourcemap(maybe..)
  const base = `/__dy_base_${createFillStr(publicPath.length + 12)}/`

  const injectScript = `const ${fakeGlobalVar}=window.${fakeGlobalVar}||window;${customVars.length > 0 ? `${fakeGlobalVar}.__m_p__=(k)=>new Proxy(()=>{},{get(_, p) {const v= ${fakeGlobalVar}[k][p];return typeof v==='function'?v.bind(${fakeGlobalVar}):v},has(target, p) { return p in ${fakeGlobalVar}[k]}, set(_,p,v){${fakeGlobalVar}[k][p]=v;return true },apply(_,t,a){return ${fakeGlobalVar}[k](...a) }})` : ''}`
  return [
    dynamicBase({
      publicPath,
      transformIndexHtml: false,
    }) as any,

    merakCSS(),
    {
      name: 'vite-plugin-merak:dev',
      apply: 'serve',
      enforce: 'post',

      async transformIndexHtml(html) {
        html = html.replace('<head>', `<head><script merak-ignore>${injectScript}</script>`)
        merakConfig._l = analyseHTML(html)
        html = html.replace('</body>', `<m-b config='${decode ? encodeURIComponent(JSON.stringify(merakConfig)) : JSON.stringify(merakConfig)}'></m-b></body>`)
        return html
      },

      transform(code, id) {
        if (filter(id))
          return `const {${desctructGlobal(nativeVars)}}=${fakeGlobalVar};${createCustomVarProxy(fakeGlobalVar, customVars)}${code}`
      },
    }, {
      name: 'vite-plugin-merak:build',
      apply: 'build',
      enforce: 'post',
      config(_conf) {
        return {
          base,
        }
      },
      configResolved(_conf) {
        config = _conf
      },

      async renderChunk(raw, chunk, opts) {
        if (!filter(chunk.fileName))
          return

        const unUsedGlobals = analyseJSGlobals(raw, [...nativeVars, ...customVars])
        unUsedGlobals.length > 0 && logger.collectUnusedGlobals(chunk.fileName, unUsedGlobals)
        const { map, code, warning } = (opts.format === 'es' ? injectGlobalToESM : injectGlobalToIIFE)(raw, fakeGlobalVar, nativeVars, customVars, force)
        if (isDebug) {
          warning.forEach(warn => logger.collectDangerUsed(chunk.fileName, warn.info, [warn.loc.start.line, warn.loc.start.column]),
          )
        }
        if (config.build.sourcemap)
          return { map, code }

        return {
          code,
        }
      },
      transformIndexHtml(html) {
        return {
          html,
          tags: [
            {
              tag: 'script',
              attrs: { 'merak-ignore': true },
              children: injectScript,

              injectTo: 'head-prepend',

            },
          ],
        }
      },

      async generateBundle(_, bundle) {
        if (config.build.ssr)
          return

        await Promise.all(
          Object.entries(bundle).map(async ([, chunk]) => {
            if (chunk.type === 'asset' && typeof chunk.source === 'string') {
              if (chunk.fileName.endsWith('.html')) {
                chunk.source = chunk.source.replaceAll(base, './')
                merakConfig._l = analyseHTML(chunk.source)

                if (!isinLine) {
                  this.emitFile({
                    fileName: 'merak.json',
                    source: JSON.stringify(merakConfig),
                    type: 'asset',
                  })
                }
                else {
                  chunk.source = chunk.source.replace('</body>', `<m-b config='${decode ? encodeURIComponent(JSON.stringify(merakConfig)) : JSON.stringify(merakConfig)}'></m-b></body>`)
                }
              }
            }
          }),
        )
        isDebug && logger.output(resolve(process.cwd(), logPath))
      },

    },

  ]
}
