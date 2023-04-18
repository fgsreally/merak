import { resolve } from 'path'
import { createRequire } from 'module'
import fse from 'fs-extra'
import cac from 'cac'
import fg from 'fast-glob'
// @ts-expect-error misstypes
import isVarName from 'is-var-name'
import { analyseHTML, analyseJSGlobals, injectGlobalToESM, injectGlobalToIIFE } from './analyse'
import { DEFAULT_INJECT_GLOBALS } from './common'
import { logger } from './log'
const cli = cac()
const root = process.cwd()
const require = createRequire(root)

cli
  .command('', 'parse all file to merak-format')
  .action(async () => {
    const {
      dir = '', globals, fakeGlobalVar, format = 'esm', isinLine = true, outDir = 'dist', includes = ['index.html', '**/*.js', '*.js', '**/*.css'], exclude = ['node_modules/**/*'], logPath,
    } = getConfig()
    if (!isVarName(fakeGlobalVar))
      throw new Error(`${fakeGlobalVar} is not a valid var`)

    const cwd = resolve(root, dir)
    fse.ensureDir(resolve(root, outDir))
    const entries = await fg(includes, { cwd, ignore: exclude })
    const globalVars = [...new Set([...DEFAULT_INJECT_GLOBALS, ...globals])]
    console.table(entries)
    console.table(globalVars)
    for (const entry of entries) {
      const filePath = resolve(root, outDir, entry)
      const raw = await fse.readFile(resolve(cwd, entry), 'utf-8')

      if (entry.endsWith('.js')) {
        if (format === 'esm') {
          const { code, warning } = injectGlobalToESM(raw, fakeGlobalVar, globalVars)
          warning.forEach(warn => logger.collectDangerUsed(entry, warn.info, [warn.loc.start.line, warn.loc.start.column]))

          await fse.outputFile(filePath, code)
        }
        else {
          const { code, warning } = injectGlobalToIIFE(raw, fakeGlobalVar, globalVars)
          warning.forEach(warn => logger.collectDangerUsed(entry, warn.info, [warn.loc.start.line, warn.loc.start.column]))

          await fse.outputFile(filePath, code)
        }
        if (logPath) {
          const unUsedGlobals = analyseJSGlobals(raw, globals)
          unUsedGlobals.length > 0 && logger.collectUnusedGlobals(entry, unUsedGlobals)
        }

        return
      }

      if (entry.endsWith('.html')) {
        const merakConfig = {
          _f: fakeGlobalVar, _g: globalVars,
        } as any
        let html = raw.replace('</head>', `</head><script merak-ignore>const ${fakeGlobalVar}=window.${fakeGlobalVar}||window</script>`)
        merakConfig._l = analyseHTML(html)
        if (isinLine)
          html = html.replace('</body>', `<merak-base config="${JSON.stringify(merakConfig)}"></merak-base></body>`)
        else await fse.outputFile(resolve(filePath, '../merak.json'), JSON.stringify(merakConfig), 'utf-8')

        await fse.outputFile(filePath, html, 'utf-8')
        return
      }
      await fse.copyFile(resolve(cwd, entry), filePath)
    }
    logPath && logger.output(resolve(root, logPath))
  })

function getConfig() {
  /**
   * {
   *  "globals":[...],
   *  "fakeGlobalVar":'..'
   *  "dir":'..',
   *  "isInline":true/false,
   *  "format":esm/iife
   * }
   */
  return require(resolve(root, 'merak.config.json'))
}

cli.help()
cli.version(require('../package.json').version)

cli.parse()
