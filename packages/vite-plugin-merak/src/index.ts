/* eslint-disable no-console */
import { DEFAULT_INJECT, analyseHTML, analyseJSGlobals, desctructGlobal, injectGlobalToESM, injectGlobalToIIFE } from 'merak-compile'
import { createFilter } from 'vite'
import type { FilterPattern, PluginOption, ResolvedConfig } from 'vite'
import type { SourceMap } from 'magic-string'
// @ts-expect-error miss types
import isVarName from 'is-var-name'
import type { TransformOptions } from './transform'

import { transformAsset, transformChunk, transformHtml } from './transform'
export function Merak(fakeGlobalName: string, globals: string[], opts: { isinLine?: boolean; includes?: FilterPattern; excludes?: FilterPattern; debug?: boolean }): PluginOption {
  if (!isVarName(fakeGlobalName))
    throw new Error(`${fakeGlobalName} is not a valid var`)

  globals.push(...DEFAULT_INJECT)

  const globalVars = [...new Set(globals)] as string[]
  const merakConfig = { _f: fakeGlobalName, _g: globalVars } as any
  const resolvedOpts = {
    includes: /\.(vue|ts|js|tsx|jsx|mjs)/,
    excludes: /\.(css|scss|sass|less)$/,
    isinLine: true,
    ...opts,
  } as Required<typeof opts>
  const { isinLine, includes, excludes } = resolvedOpts
  const filter = createFilter(includes, excludes)
  const PATH_PLACEHOLDER = '/dynamic_base__/'
  let config: ResolvedConfig
  const publicPath = `${fakeGlobalName}.__merak_url__`
  // const preloadHelperId = 'vite/preload-helper'

  const baseOptions: TransformOptions = { assetsDir: 'assets', base: PATH_PLACEHOLDER, publicPath: ` ${publicPath}` }
  return [{
    name: 'vite-plugin-merak:debug',
    transform(code, id) {
      if (!filter(id))
        return
      if (process.env.DEBUG || opts.debug) {
        console.log(`\n${id}`)
        console.table(analyseJSGlobals(code, globalVars))
      }
    },
  }, {
    name: 'vite-plugin-merak:dev',
    apply: 'serve',
    enforce: 'post',

    async transformIndexHtml(html) {
      html = html.replace('</head>', `</head><script merak-ignore>const ${fakeGlobalName}=window.${fakeGlobalName}||window</script>`)
      merakConfig._t = analyseHTML(html)
      html = html.replace('</body>', `<merak-base config="${JSON.stringify(merakConfig)}"></merak-base></body>`)
      return html
    },

    transform(code, id) {
      if (filter(id)) {
        // if (extname(id) === '.css')
        //   return
        return `const {${desctructGlobal(globalVars)}}=${fakeGlobalName}\n${code}`
      }
    },
  }, {
    name: 'vite-plugin-merak:build',
    apply: 'build',
    enforce: 'post',
    config() {
      return {
        base: PATH_PLACEHOLDER,
      }
    },
    configResolved(_conf) {
      config = _conf
      baseOptions.assetsDir = _conf.build.assetsDir
    },
    async renderChunk(raw, chunk, opts) {
      if (!filter(chunk.fileName))
        return
      let ret: { code: string; map: SourceMap }
      if (opts.format === 'es')
        ret = injectGlobalToESM(raw, fakeGlobalName, globalVars)

      else
        ret = injectGlobalToIIFE(raw, fakeGlobalName, globalVars)

      if (config.build.sourcemap)
        return ret

      return {
        code: ret.code,
      }
    },
    transformIndexHtml(html) {
      html = html.replace('</head>', `</head><script merak-ignore>const ${fakeGlobalName}=window.${fakeGlobalName}||window</script>`)
      return html
    },

    async generateBundle({ format }, bundle) {
      if (config.build.ssr)
        return

      if (format !== 'es' && format !== 'system')
        return

      await Promise.all(
        Object.entries(bundle).map(async ([, chunk]) => {
          if (chunk.type === 'chunk' && chunk.code.includes(baseOptions.base)) {
            chunk.code = await transformChunk(format, chunk.code, baseOptions)
          }
          else if (chunk.type === 'asset' && typeof chunk.source === 'string') {
            if (!chunk.fileName.endsWith('.html')) {
              chunk.source = await transformAsset(chunk.source, baseOptions)
            }
            else {
              chunk.source = transformHtml(chunk.source, baseOptions)
              merakConfig._t = analyseHTML(chunk.source)

              if (!isinLine) {
                this.emitFile({
                  fileName: 'merak.json',
                  source: JSON.stringify(merakConfig),
                  type: 'asset',
                })
              }
              else {
                chunk.source = chunk.source.replace('</body>', `<merak-base config='${JSON.stringify(merakConfig)}'></merak-base></body`)
              }
            }
          }
        }),
      )
    },

  },

  ]
}

export { merakPostCss } from 'merak-compile'
