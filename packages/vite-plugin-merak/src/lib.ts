import { resolve } from 'path'
import { DEFAULT_NATIVE_VARS, getUnusedGlobalVariables, injectGlobalToESM, injectGlobalToIIFE, logger, merakPostCss } from 'merak-compile'
import { createFilter } from 'vite'
// @ts-expect-error miss types
import isVarName from 'is-var-name'
import type { FilterPattern, PluginOption } from 'vite'

export { merakPostCss }
export function MerakLib(projectGlobalVar: string, opts: { isinLine?: boolean; includes?: FilterPattern; exclude?: FilterPattern; logPath?: string; force?: boolean; nativeVars?: string[]; customVars?: string[] } = {}): PluginOption {
  const { nativeVars = [], customVars = [], includes = /\.(ts|js|tsx|jsx|mjs)/, exclude, logPath, force } = opts
  if (!isVarName(projectGlobalVar))
    throw new Error(`${projectGlobalVar} is not a valid var`)

  nativeVars.push(...DEFAULT_NATIVE_VARS.filter(item => !['location', 'history'].includes(item)))

  // const globalVars = [...new Set(globals)] as string[]
  const isDebug = !!logPath
  const filter = createFilter(includes, exclude)
  return [merakCSS(), {
    name: 'vite-plugin-merak:lib',
    apply: 'build',
    enforce: 'post',
    async renderChunk(raw, chunk, opts) {
      if (!filter(chunk.fileName))
        return

      const unUsedGlobals = getUnusedGlobalVariables(raw, [...nativeVars, ...customVars])
      unUsedGlobals.length > 0 && logger.collectUnscopedVar(chunk.fileName, unUsedGlobals)
      const { map, code, warning } = (opts.format === 'es' ? injectGlobalToESM : injectGlobalToIIFE)(raw, projectGlobalVar, nativeVars, customVars, force)
      if (isDebug) {
        warning.forEach(warn => logger.collectDangerUsed(chunk.fileName, warn.info, [warn.loc.start.line, warn.loc.start.column]),
        )
      }
      return { map, code }
    },
    closeBundle() {
      isDebug && logger.output(resolve(process.cwd(), logPath))
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
