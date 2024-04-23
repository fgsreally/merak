import { resolve } from 'path'
import { Compiler, DEFAULT_NATIVE_VARS, merakPostCss } from 'merak-compile'
import { createFilter } from 'vite'
// @ts-expect-error miss types
import isVarName from 'is-var-name'
import type { FilterPattern, PluginOption } from 'vite'

export { merakPostCss }
export function MerakLib(projectGlobalVar: string, opts: { compiler?: typeof Compiler; includes?: FilterPattern; exclude?: FilterPattern; logPath?: string; force?: boolean; nativeVars?: string[]; customVars?: string[] } = {}): PluginOption {
  const { nativeVars = [], customVars = [], includes = /\.(ts|js|tsx|jsx|mjs)/, exclude, logPath, force, compiler: C = Compiler } = opts
  if (!isVarName(projectGlobalVar))
    throw new Error(`${projectGlobalVar} is not a valid variable name`)

  const compiler = new C(projectGlobalVar, nativeVars, customVars)
  nativeVars.push(...DEFAULT_NATIVE_VARS.filter(item => !['location', 'history'].includes(item)))

  // const globalVars = [...new Set(globals)] as string[]
  const filter = createFilter(includes, exclude)
  return [merakCSS(), {
    name: 'vite-plugin-merak:lib',
    apply: 'build',
    enforce: 'post',
    async renderChunk(raw, chunk, opts) {
      if (!filter(chunk.fileName))
        return

      const { map, code } = opts.format === 'es' ? compiler.compileESM(raw, chunk.fileName, force) : compiler.compileScript(raw, chunk.fileName, force)

      return { map, code }
    },
    closeBundle() {
      logPath && compiler.output(resolve(process.cwd(), logPath))
    },
  }]
}
export function merakCSS(): PluginOption {
  return {
    name: 'vite-plugin-merak:postcss',
    enforce: 'pre',
    config() {
      return {
        css: {
          postcss: {
            plugins: [merakPostCss()],
          },
        },
      }
    },

  }
}
