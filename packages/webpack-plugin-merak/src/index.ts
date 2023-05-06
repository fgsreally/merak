import { resolve } from 'path'
import type { Compiler } from 'webpack'
import { DEFAULT_INJECT_GLOBALS, analyseHTML, analyseJSGlobals, desctructGlobal, injectGlobalToESM, injectGlobalToIIFE, logger } from 'merak-compile'
// @ts-expect-error miss types
import isVarName from 'is-var-name'
import type HtmlWebpackPlugin from 'html-webpack-plugin'
import { Compilation, sources } from 'webpack'

const fileSet = new Set<string>()
let htmlPlugin: typeof HtmlWebpackPlugin
export class Merak {
  constructor(public fakeGlobalVar: string, public globals: string[], public options: { filter?: (file: string) => boolean; force?: boolean; logPath?: string; isInLine?: boolean } = {}) {
    if (!isVarName(fakeGlobalVar))
      throw new Error(`${fakeGlobalVar} is not a valid var`)
  }

  apply(compiler: Compiler) {
    const { mode } = compiler.options

    const format = compiler.options.output.chunkFormat
    const { fakeGlobalVar, globals } = this
    globals.push(...DEFAULT_INJECT_GLOBALS)
    const isDebug = !!this.options.logPath
    const globalVars = [...new Set(globals)] as string[]
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
                if (mode === 'development') {
                  if (fileSet.has(file))
                    return
                  fileSet.add(file)
                }

                if (this.options.filter && !this.options.filter(file))
                  return
                const source = compilation.getAsset(file)!.source.source() as string
                if (isDebug) {
                  const unUsedGlobals = analyseJSGlobals(source, this.globals)
                  unUsedGlobals.length > 0 && logger.collectUnusedGlobals(file, unUsedGlobals)
                }
                const { code, warning } = (format === 'module' ? injectGlobalToESM : injectGlobalToIIFE)(source, fakeGlobalVar, globalVars, this.options?.force || false)

                if (isDebug)
                  warning.forEach(warn => logger.collectDangerUsed(file, warn.info, [warn.loc.start.line, warn.loc.start.column]))

                compilation.updateAsset(file, new sources.RawSource(code))
              }
            })
          })
          isDebug && logger.output(resolve(process.cwd(), this.options.logPath!))
        },
      )
    })

    for (const plugin of compiler.options.plugins) {
      if (plugin.constructor.name === 'HtmlWebpackPlugin')
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
            innerHTML: `const ${fakeGlobalVar}=window.${fakeGlobalVar}||window`,
            attributes: {
              'merak-ignore': true,
            },
          })

          return data
        },
      )
      htmlPlugin.getHooks(compilation).beforeEmit.tap('MerakPlugin', (data) => {
        const merakConfig = { _f: fakeGlobalVar, _g: globalVars, _l: analyseHTML(data.html) }
        if (this.options.isInLine === false) {
          compilation.emitAsset('merak.json', new sources.RawSource(
            JSON.stringify(merakConfig),
          ))
        }
        else {
          data.html = data.html.replace('</body>', `<m-b config='${encodeURIComponent(JSON.stringify(merakConfig))}'></m-b></body>`)
        }

        return data
      })
    })
  }
}

export function injectGlobals(fakeGlobalVar: string, globals: string[], code: string) {
  return `(()=>{const {${desctructGlobal(globals)}}=${fakeGlobalVar}\n${code})()`
}

export { merakPostCss } from 'merak-compile'
