import { resolve } from 'path'
import { DEFAULT_INJECT_GLOBALS, analyseHTML, analyseJSGlobals, desctructGlobal, injectGlobalToESM, injectGlobalToIIFE, logger } from 'merak-compile'
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

// eslint-disable-next-line import/export
export * from './lib'

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
  let config: ResolvedConfig
  const publicPath = `(${fakeGlobalVar}.__merak_url__||'')`
  // work in sourcemap(maybe..)
  const base = `/__dy_base_${createFillStr(publicPath.length + 12)}/`

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
                  chunk.source = chunk.source.replace('</body>', `<m-b config='${encodeURIComponent(JSON.stringify(merakConfig))}'></m-b></body>`)
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
