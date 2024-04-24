import { resolve } from 'path'
import { Compiler, DEFAULT_NATIVE_VARS } from 'merak-compile'
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

export function Merak(projectGlobalVar: string, opts: { includes?: FilterPattern; exclude?: FilterPattern; logPath?: string; force?: boolean; nativeVars?: string[]; customVars?: string[];compiler?: typeof Compiler } = {}): PluginOption {
  if (!isVarName(projectGlobalVar))
    throw new Error(`${projectGlobalVar} is not a valid variable name`)

  // const globalVars = [...new Set(globals)] as string[]
  const { nativeVars = [], customVars = [], includes = /\.(vue|ts|js|tsx|jsx|mjs)/, exclude = /\.(css|scss|sass|less)$/, logPath, force, compiler: C = Compiler } = opts
  const compiler = new C(projectGlobalVar, nativeVars, customVars)
  nativeVars.push(...DEFAULT_NATIVE_VARS)

  const filter = createFilter(includes, exclude)
  let config: ResolvedConfig
  const publicPath = `(${projectGlobalVar}.__m_url__||'')`
  // work in sourcemap(maybe..)
  const base = `/__dy_base_${createFillStr(publicPath.length + 8)}/`

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
      async transformIndexHtml(html, ctx) {
        return compiler.compileHTML(html, ctx.filename).code
      },

      transform(str, id) {
        if (filter(id)) {
          const { code, map } = compiler.compileESM(str, id)
          return { code, map }
        }
        // return `const {${desctructVars(nativeVars)}}=${projectGlobalVar};${createCustomVarProxy(projectGlobalVar, customVars)}${code}`
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

        const { map, code } = opts.format === 'es' ? compiler.compileESM(raw, chunk.fileName, force) : compiler.compileScript(raw, chunk.fileName, force)

        return { map, code }
      },
      // transformIndexHtml(html) {
      //   return {
      //     html,
      //     tags: [
      //       {
      //         tag: 'script',
      //         attrs: { 'merak-ignore': true },
      //         children: injectScript,

      //         injectTo: 'head-prepend',

      //       },
      //     ],
      //   }
      // },

      async generateBundle(_, bundle) {
        // @todo
        if (config.build.ssr)
          return

        await Promise.all(
          Object.entries(bundle).map(async ([, chunk]) => {
            if (chunk.type === 'asset' && typeof chunk.source === 'string') {
              if (chunk.fileName.endsWith('.html'))
                chunk.source = compiler.compileHTML(chunk.source.replaceAll(base, './'), chunk.fileName).code
            }
          }),
        )

        if (logPath)
          compiler.output(resolve(process.cwd(), logPath))
      },

    },

  ]
}
