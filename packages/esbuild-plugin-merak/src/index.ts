import type { Plugin } from 'esbuild'
import { analyseHTML, compileHTML, getUnusedGlobalVariables, injectGlobalToESM, logger, merakPostCss } from 'merak-compile'
import postcss from 'postcss'
// only work for prod
export function Merak(fakeGlobalVar: string, opts: { exclude?: RegExp; logPath?: string; force?: boolean; nativeVars?: string[]; customVars?: string[]; loader?: 'runtime' | 'compile' } = {}): Plugin {
  const { logPath, nativeVars = [], customVars = [], exclude, force, loader } = opts
  const isDebug = !!logPath
  const merakConfig = { _f: fakeGlobalVar, _n: nativeVars, _c: customVars } as any
  const injectScript = `const ${fakeGlobalVar}=window.${fakeGlobalVar}||window;${customVars.length > 0 ? `${fakeGlobalVar}.__m_p__=(k)=>new Proxy(()=>{},{get(_, p) {const v= ${fakeGlobalVar}[k][p];return typeof v==='function'?v.bind(${fakeGlobalVar}):v},has(target, p) { return p in ${fakeGlobalVar}[k]}, set(_,p,v){${fakeGlobalVar}[k][p]=v;return true },apply(_,t,a){return ${fakeGlobalVar}[k](...a) }})` : ''}`
  const processor = postcss([merakPostCss])
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
            const unUsedGlobals = getUnusedGlobalVariables(raw, [...nativeVars, ...customVars])
            unUsedGlobals.length > 0 && logger.collectUnscopedVar(item.path, unUsedGlobals)
            const { code, warning } = injectGlobalToESM(raw, fakeGlobalVar, nativeVars, customVars, force)
            if (isDebug) {
              warning.forEach(warn => logger.collectDangerUsed(item.path, warn.info, [warn.loc.start.line, warn.loc.start.column]),
              )
            }
            item.contents = strToUint8(code)

            continue
          }
          if (item.path.endsWith('.html')) {
            const html = compileHTML(item.text.replace('<head>', `<head><script merak-ignore>${injectScript}</script>`), fakeGlobalVar)
            if (loader === 'compile') {
              merakConfig._l = analyseHTML(html).map((item) => {
                // logger.collectAction(`replace url "${item.src}"`)
                return item.loc
              })
            }

            item.contents = strToUint8(html.replace('</body>', `<merak c='${encodeURIComponent(JSON.stringify(merakConfig))}'></m-b></body>`))
          }
          if (item.path.endsWith('.css')) {
            const { css } = await processor.process(item.text)
            item.contents = strToUint8(css)
          }
        }
      })
    },

  }
}

function strToUint8(str: string) {
  const encoder = new TextEncoder()
  return encoder.encode(str)
}
