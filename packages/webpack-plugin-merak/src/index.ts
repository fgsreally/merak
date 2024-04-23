import { resolve } from 'path'
import type { Compiler } from 'webpack'
import { Compilation, sources } from 'webpack'
import { DEFAULT_NATIVE_VARS, Compiler as MerakCompiler } from 'merak-compile'
// @ts-expect-error miss types
import isVarName from 'is-var-name'
import type HtmlWebpackPlugin from 'html-webpack-plugin'

let htmlPlugin: typeof HtmlWebpackPlugin
export class Merak {
  constructor(public projectGlobalVar: string, public options: { filter?: (file: string) => boolean
    force?: boolean
    logPath?: string
    nativeVars?: string[]
    customVars?: string[]
    compiler?: typeof MerakCompiler } = {}) {
    if (!isVarName(projectGlobalVar))
      throw new Error(`${projectGlobalVar} is not a valid variable name`)
  }

  apply(compiler: Compiler) {
    // const { mode } = compiler.options
    const { projectGlobalVar, options: { nativeVars = [], customVars = [], force = false, logPath, compiler: C = MerakCompiler, filter } } = this

    const format = compiler.options.output.chunkFormat
    nativeVars.push(...DEFAULT_NATIVE_VARS)

    const mCompiler = new C(projectGlobalVar, nativeVars, customVars)

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
              if (/\.(js|mjs|cjs)/.test(file)) {
                if (filter && filter(file))
                  return
                const source = compilation.getAsset(file)!.source.source() as string

                const { code } = (format === 'module' ? mCompiler.compileESM(source, file, force) : mCompiler.compileScript(source, file, force))
                // @todo to support map
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
      // htmlPlugin.getHooks(compilation).alterAssetTags.tap(
      //   'MerakPlugin',
      //   (data) => {
      //     // 额外添加scripts
      //     const scriptTag = data.assetTags.scripts
      //     scriptTag.unshift({
      //       tagName: 'script',
      //       voidTag: false,
      //       meta: { plugin: 'MerakPlugin' },
      //       innerHTML: injectScript,
      //       attributes: {
      //         'merak-ignore': true,
      //       },
      //     })

      //     return data
      //   },
      // )
      htmlPlugin.getHooks(compilation).beforeEmit.tap('MerakPlugin', (data) => {
        data.html = mCompiler.compileHTML(data.html, data.outputName).code

        logPath && mCompiler.output(resolve(process.cwd(), logPath!))

        return data
      })
    })
  }
}

// export function injectGlobals(projectGlobalVar: string, globals: string[], code: string) {
//   return `(()=>{const {${desctructVars(globals)}}=${projectGlobalVar}\n${code})()`
// }

export { merakPostCss } from 'merak-compile'
