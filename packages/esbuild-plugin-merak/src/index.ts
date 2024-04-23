import type { Plugin } from 'esbuild'
import { Compiler } from 'merak-compile'
// only work for prod
// @experiment
export function Merak(projectGlobalVar: string, opts: { exclude?: RegExp; logPath?: string; force?: boolean; nativeVars?: string[]; customVars?: string[]; compiler?: typeof Compiler } = {}): Plugin {
  const { logPath, nativeVars = [], customVars = [], exclude, force, compiler: C = Compiler } = opts

  const compiler = new C(projectGlobalVar, nativeVars, customVars)
  return {
    name: 'merak-esbuild',
    setup(build) {
      build.onEnd(async (result) => {
        if (!result.outputFiles)
          return
        for (const item of result.outputFiles) {
          if (exclude && exclude.test(item.path))
            continue
          if (item.path.endsWith('.js')) {
            const raw = item.text

            const { code } = compiler.compileESM(raw, item.path, force)

            item.contents = strToUint8(code)

            continue
          }
          if (item.path.endsWith('.html'))

            item.contents = strToUint8(compiler.compileHTML(item.text, item.path).code)

          if (item.path.endsWith('.css'))
            item.contents = strToUint8(compiler.compileStyle(item.text, item.path).code)
        }

        logPath && compiler.output(logPath)
      })
    },

  }
}

function strToUint8(str: string) {
  const encoder = new TextEncoder()
  return encoder.encode(str)
}
