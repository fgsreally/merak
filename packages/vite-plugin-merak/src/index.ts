import { resolve } from 'path'
import { DEFAULT_INJECT_GLOBALS, analyseHTML, analyseJSGlobals, desctructGlobal, injectGlobalToESM, injectGlobalToIIFE, logger } from 'merak-compile'
import { createFilter } from 'vite'
import type { FilterPattern, PluginOption, ResolvedConfig } from 'vite'
// @ts-expect-error miss types
import isVarName from 'is-var-name'
import type { TransformOptions } from './transform'

import { transformAsset, transformChunk, transformHtml } from './transform'
export function Merak(fakeGlobalVar: string, globals: string[], opts: { isinLine?: boolean; includes?: FilterPattern; exclude?: FilterPattern; logPath?: string; force?: boolean } = {}): PluginOption {
  if (!isVarName(fakeGlobalVar))
    throw new Error(`${fakeGlobalVar} is not a valid var`)

  globals.push(...DEFAULT_INJECT_GLOBALS)

  const globalVars = [...new Set(globals)] as string[]
  const merakConfig = { _f: fakeGlobalVar, _g: globalVars } as any
  const resolvedOpts = {
    includes: /\.(vue|ts|js|tsx|jsx|mjs)/,
    exclude: /\.(css|scss|sass|less)$/,
    isinLine: true,
    ...opts,
  } as Required<typeof opts>
  const isDebug = !!resolvedOpts.logPath
  const { isinLine, includes, exclude } = resolvedOpts
  const filter = createFilter(includes, exclude)
  const PATH_PLACEHOLDER = '/dynamic_base__/'
  let config: ResolvedConfig
  const publicPath = `(${fakeGlobalVar}.__merak_url__||'')`
  // const preloadHelperId = 'vite/preload-helper'

  const baseOptions: TransformOptions = { assetsDir: 'assets', base: PATH_PLACEHOLDER, publicPath: ` ${publicPath}` }
  return [{
    name: 'vite-plugin-merak:dev',
    apply: 'serve',
    enforce: 'post',

    async transformIndexHtml(html) {
      html = html.replace('</head>', `</head><script merak-ignore>const ${fakeGlobalVar}=window.${fakeGlobalVar}||window</script>`)
      merakConfig._l = analyseHTML(html)
      html = html.replace('</body>', `<m-b config='${encodeURIComponent(JSON.stringify(merakConfig))}'></m-b></body>`)
      return html
    },

    transform(code, id) {
      if (filter(id)) {
        // if (extname(id) === '.css')
        //   return
        return `const {${desctructGlobal(globalVars)}}=${fakeGlobalVar}\n${code}`
      }
    },
  }, {
    name: 'vite-plugin-merak:build',
    apply: 'build',
    enforce: 'post',
    config(_conf) {
      if (!_conf) {
        return {
          base: PATH_PLACEHOLDER,
        }
      }
    },
    configResolved(_conf) {
      config = _conf
      baseOptions.assetsDir = _conf.build.assetsDir
      baseOptions.base = _conf.base
    },

    async renderChunk(raw, chunk, opts) {
      if (!filter(chunk.fileName))
        return

      const unUsedGlobals = analyseJSGlobals(raw, globalVars)
      unUsedGlobals.length > 0 && logger.collectUnusedGlobals(chunk.fileName, unUsedGlobals)
      const { map, code, warning } = (opts.format === 'es' ? injectGlobalToESM : injectGlobalToIIFE)(raw, fakeGlobalVar, globalVars, resolvedOpts.force)
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
      html = html.replace('</head>', `</head><script merak-ignore>const ${fakeGlobalVar}=window.${fakeGlobalVar}||window</script>`)
      return html
    },

    async generateBundle({ format }, bundle) {
      if (config.build.ssr)
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
              merakConfig._l = analyseHTML(chunk.source)

              if (!isinLine) {
                this.emitFile({
                  fileName: 'merak.json',
                  source: JSON.stringify(merakConfig),
                  type: 'asset',
                })
              }
              else {
                chunk.source = chunk.source.replace('</body>', `<m-b config='${encodeURIComponent(JSON.stringify(merakConfig))}'></m-b></body`)
              }
            }
          }
        }),
      )
      isDebug && logger.output(resolve(process.cwd(), resolvedOpts.logPath))
    },

  },

  ]
}

export { merakPostCss } from 'merak-compile'
