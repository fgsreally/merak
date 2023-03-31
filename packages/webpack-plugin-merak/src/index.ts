import type { Compiler } from 'webpack'
import { DEFAULT_INJECT_GLOBALS, analyseHTML, desctructGlobal } from 'merak-compile'
import HtmlWebpackPlugin from 'html-webpack-plugin'
// @ts-expect-error miss types
import WrapperPlugin from 'wrapper-webpack-plugin'
// @ts-expect-error miss types
import isVarName from 'is-var-name'

/**
 * @TODO
 * replace WrapperPlugin
 * it would inject all globalVars to each chunk with no treeshake
 */
export class Merak {
  constructor(public fakeGlobalVar: string, public globals: string[], public options?: { filter?: RegExp }) {
    if (!isVarName(fakeGlobalVar))
      throw new Error(`${fakeGlobalVar} is not a valid var`)
  }

  apply(compiler: Compiler) {
    const format = compiler.options.output.chunkFormat
    const { fakeGlobalVar, globals } = this
    globals.push(...DEFAULT_INJECT_GLOBALS)

    const globalVars = [...new Set(globals)] as string[]
    if (format === 'module') {
      new WrapperPlugin({
        test: this.options?.filter || /\.js$/, // only wrap output of bundle files with '.js' extension
        header: `const {${desctructGlobal(globalVars)}}=${fakeGlobalVar};`,
        footer: '',
      }).apply(compiler)
    }
    else {
      new WrapperPlugin({
        test: /\.js$/, // only wrap output of bundle files with '.js' extension
        header: `(()=>{const {${desctructGlobal(globalVars)}}=${fakeGlobalVar};`,
        footer: '})()',
      }).apply(compiler)
    }

    compiler.hooks.compilation.tap('webpack-merak', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tap(
        'webpack-merak',
        (data) => {
          // 额外添加scripts
          const scriptTag = data.assetTags.scripts
          scriptTag.unshift({
            tagName: 'script',
            voidTag: false,
            meta: { plugin: 'webpack-merak' },
            innerHTML: `const ${fakeGlobalVar}=window.${fakeGlobalVar}||window`,
            attributes: {
              'merak-ignore': true,
            },
          })

          return data
        },
      )
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tap('webpack-merak', (data) => {
        const merakConfig = { _f: fakeGlobalVar, _g: globalVars, _t: analyseHTML(data.html) }

        data.html = data.html.replace('</body>', `<merak-base config='${JSON.stringify(merakConfig)}'></merak-base></body`)

        return data
      })
    })
  }
}

export function injectGlobals(fakeGlobalVar: string, globals: string[], code: string) {
  return `(()=>{const {${desctructGlobal(globals)}}=${fakeGlobalVar}\n${code})()`
}

export { merakPostCss } from 'merak-compile'
