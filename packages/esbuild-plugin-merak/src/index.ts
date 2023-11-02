import type { Plugin } from 'esbuild'

// to do
// @experiment
export function Merak(fakeGlobalVar: string, opts: { output?: string; includes?: FilterPattern; exclude?: FilterPattern; logPath?: string; force?: boolean; nativeVars?: string[]; customVars?: string[]; loader?: 'runtime' | 'compile' } = {}): Plugin {
  const { logPath } = opts
  const isDebug = !!logPath

  return {
    name: 'example',
    setup(build) {
      build.onEnd((result) => {
        for (const item of result.outputFiles) {
          if (item.path.endsWith('.js')) {
            const raw = item.text
            const unUsedGlobals = analyseJSGlobals(raw, [...nativeVars, ...customVars])
            unUsedGlobals.length > 0 && logger.collectUnusedGlobals(chunk.fileName, unUsedGlobals)
            const { code, warning } = injectGlobalToESM(raw, fakeGlobalVar, nativeVars, customVars, force)
            if (isDebug) {
              warning.forEach(warn => logger.collectDangerUsed(chunk.fileName, warn.info, [warn.loc.start.line, warn.loc.start.column]),
              )
            }
            item.content = strToUint8(code)

            continue
          }
          // if (item.path.endsWith('.css')) {

          // }
        }
      })
    },

  }
}

function strToUint8(str: string) {
  const arr = []
  for (let i = 0, j = str.length; i < j; ++i)
    arr.push(str.charCodeAt(i))

  return new Uint8Array(arr)
}
