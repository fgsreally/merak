import { resolve } from 'path'
import type { Compiler } from 'webpack'
import { DEFAULT_NATIVE_VARS, analyseHTML, compileHTML, getUnusedGlobalVariables, injectGlobalToESM, injectGlobalToIIFE, logger } from 'merak-compile'
// @ts-expect-error miss types
import isVarName from 'is-var-name'
import type HtmlWebpackPlugin from 'html-webpack-plugin'
import { Compilation, sources } from 'webpack'

let htmlPlugin: typeof HtmlWebpackPlugin
export class Merak {
  constructor(public projectGlobalVar: string, public options: { filter?: (file: string) => boolean; force?: boolean; logPath?: string; output?: string; nativeVars?: string[]; customVars?: string[]; loader?: 'runtime' | 'compile' } = {}) {
    if (!isVarName(projectGlobalVar))
      throw new Error(`${projectGlobalVar} is not a valid var`)
  }

  apply(compiler: Compiler) {
    // const { mode } = compiler.options

    const format = compiler.options.output.chunkFormat
    const { projectGlobalVar, options: { nativeVars = [], customVars = [], force = false, loader = 'compile', output } } = this
    nativeVars.push(...DEFAULT_NATIVE_VARS)
    const isDebug = !!this.options.logPath
    const injectScript = `const ${projectGlobalVar}=window.${projectGlobalVar}||window;${customVars.length > 0 ? `${projectGlobalVar}.__m_p__=(k)=>new Proxy(()=>{},{get(_, p) {const v= ${projectGlobalVar}[k][p];return typeof v==='function'?v.bind(${projectGlobalVar}):v},has(target, p) { return p in ${projectGlobalVar}[k]}, set(_,p,v){${projectGlobalVar}[k][p]=v;return true },apply(_,t,a){return ${projectGlobalVar}[k](...a) }})` : ''}`

    compiler.hooks.thisCompilation.tap('MerakPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'MerakPlugin',
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        () => {
          const chunks = compilation.chunks
          chunks.forEach((chunk) => {
            chunk.files.forEach((file) => {
              if (file.endsWith('.js')) {
                if (this.options.filter && !this.options.filter(file))
                  return
                const source = compilation.getAsset(file)!.source.source() as string
                if (isDebug) {
                  const unUsedGlobals = getUnusedGlobalVariables(source, [...nativeVars, ...customVars])
                  unUsedGlobals.length > 0 && logger.collectUnscopedVar(file, unUsedGlobals)
                }
                const { code, warning } = (format === 'module' ? injectGlobalToESM : injectGlobalToIIFE)(source, projectGlobalVar, nativeVars, customVars, force)

                if (isDebug)
                  warning.forEach(warn => logger.collectDangerUsed(file, warn.info, [warn.loc.start.line, warn.loc.start.column]))

                compilation.updateAsset(file, new sources.RawSource(code))
              }
            })
          })
        },
      )
    })

    for (const plugin of compiler.options.plugins) {
      if (plugin && plugin.constructor.name === 'HtmlWebpackPlugin')
        htmlPlugin = plugin.constructor as any
    }

    htmlPlugin && compiler.hooks.compilation.tap('MerakPlugin', async (compilation) => {
      htmlPlugin.getHooks(compilation).alterAssetTags.tap(
        'MerakPlugin',
        (data) => {
          // 额外添加scripts
          const scriptTag = data.assetTags.scripts
          scriptTag.unshift({
            tagName: 'script',
            voidTag: false,
            meta: { plugin: 'MerakPlugin' },
            innerHTML: injectScript,
            attributes: {
              'merak-ignore': true,
            },
          })

          return data
        },
      )
      htmlPlugin.getHooks(compilation).beforeEmit.tap('MerakPlugin', (data) => {
        const merakConfig: any = { _f: projectGlobalVar, _n: nativeVars, _c: customVars }

        data.html = compileHTML(data.html, this.projectGlobalVar)

        if (loader === 'compile') {
          merakConfig._l = analyseHTML(data.html).map((item) => {
            logger.collectAction(`replace url "${item.src}"`)
            return item.loc
          })
        }
        if (output) {
          compilation.emitAsset(output, new sources.RawSource(
            JSON.stringify(merakConfig),
          ))
        }
        else {
          data.html = data.html.replace('</body>', `<merak c='${encodeURIComponent(JSON.stringify(merakConfig))}'></m-b></body>`)
        }
        isDebug && logger.output(resolve(process.cwd(), this.options.logPath!))

        return data
      })
    })
  }
}

// export function injectGlobals(projectGlobalVar: string, globals: string[], code: string) {
//   return `(()=>{const {${desctructVars(globals)}}=${projectGlobalVar}\n${code})()`
// }

export { merakPostCss } from 'merak-compile'
