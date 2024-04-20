import { resolve } from 'path'
import { DEFAULT_NATIVE_VARS, analyseHTML, compileHTML, getUnusedGlobalVariables, injectGlobalToESM, injectGlobalToIIFE, logger } from 'merak-compile'
import { createFilter } from 'vite'
import type { FilterPattern, PluginOption, ResolvedConfig } from 'vite'
// @ts-expect-error miss types
import isVarName from 'is-var-name'
import { dynamicBase } from 'vite-plugin-dynamic-base'
import { merakCSS } from './lib'

// work for sourcemap
function createFillStr(length: number) {
  let str = ''
  for (let i = 0; i < length; i++)
    str += 'a'

  return str
}

export * from './lib'

export function Merak(fakeGlobalVar: string, opts: { output?: string; includes?: FilterPattern; exclude?: FilterPattern; logPath?: string; force?: boolean; nativeVars?: string[]; customVars?: string[];loader?: 'runtime' | 'compile' } = {}): PluginOption {
  if (!isVarName(fakeGlobalVar))
    throw new Error(`${fakeGlobalVar} is not a valid var`)

  // const globalVars = [...new Set(globals)] as string[]
  const { nativeVars = [], customVars = [], includes = /\.(vue|ts|js|tsx|jsx|mjs)/, exclude = /\.(css|scss|sass|less)$/, logPath, force, output, loader = 'compile' } = opts
  const merakConfig = { _f: fakeGlobalVar, _n: nativeVars, _c: customVars } as any

  nativeVars.push(...DEFAULT_NATIVE_VARS)

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
      config() {
        return {
          server: {
            cors: true,
          },
        }
      },
      async transformIndexHtml(html) {
        html = compileHTML(html.replace('<head>', `<head><script merak-ignore>${injectScript}</script>`), fakeGlobalVar)
        if (loader === 'compile') {
          merakConfig._l = analyseHTML(html).map((item) => {
            // logger.collectAction(`replace url "${item.src}"`)
            return item.loc
          })
        }
        html = html.replace('</body>', `<merak c='${encodeURIComponent(JSON.stringify(merakConfig))}'></m-b></body>`)
        return html
      },

      transform(str, id) {
        if (filter(id)) {
          const { code } = injectGlobalToESM(str, fakeGlobalVar, nativeVars, customVars, force)
          return { code }
        }
        // return `const {${desctructVars(nativeVars)}}=${fakeGlobalVar};${createCustomVarProxy(fakeGlobalVar, customVars)}${code}`
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

        const unUsedGlobals = getUnusedGlobalVariables(raw, [...nativeVars, ...customVars])
        unUsedGlobals.length > 0 && logger.collectUnscopedVar(chunk.fileName, unUsedGlobals)
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
                chunk.source = compileHTML(chunk.source.replaceAll(base, './'), fakeGlobalVar)
                if (loader === 'compile') {
                  merakConfig._l = analyseHTML(chunk.source).map((item) => {
                    logger.collectAction(`replace url "${item.src}"`)
                    return item.loc
                  })
                }

                if (output) {
                  this.emitFile({
                    fileName: output,
                    source: JSON.stringify(merakConfig),
                    type: 'asset',
                  })
                }
                else {
                  chunk.source = chunk.source.replace('</body>', `<merak c='${encodeURIComponent(JSON.stringify(merakConfig))}'></m-b></body>`)
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
