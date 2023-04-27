import { resolve } from 'path'
import type { Compiler } from 'webpack'
import { DEFAULT_INJECT_GLOBALS, analyseHTML, analyseJSGlobals, desctructGlobal, injectGlobalToESM, injectGlobalToIIFE, logger } from 'merak-compile'
import HtmlWebpackPlugin from 'html-webpack-plugin'
// @ts-expect-error miss types
import isVarName from 'is-var-name'
import { Compilation, sources } from 'webpack'

export class Merak {
  constructor(public fakeGlobalVar: string, public globals: string[], public options: { filter?: RegExp; force?: boolean; logPath?: string } = {}) {
    if (!isVarName(fakeGlobalVar))
      throw new Error(`${fakeGlobalVar} is not a valid var`)
  }

  apply(compiler: Compiler) {
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

    compiler.hooks.compilation.tap('MerakPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tap(
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
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tap('MerakPlugin', (data) => {
        const merakConfig = { _f: fakeGlobalVar, _g: globalVars, _l: analyseHTML(data.html) }

        data.html = data.html.replace('</body>', `<m-b config='${encodeURIComponent(JSON.stringify(merakConfig))}'></m-b></body`)

        return data
      })
    })
  }
}

export function injectGlobals(fakeGlobalVar: string, globals: string[], code: string) {
  return `(()=>{const {${desctructGlobal(globals)}}=${fakeGlobalVar}\n${code})()`
}

export { merakPostCss } from 'merak-compile'
