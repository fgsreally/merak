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
const cli = cac('merak')
const root = process.cwd()
const require = createRequire(root)

cli.command('init', 'create merak.config.json').action(() => {
  fse.outputFile(resolve(root, 'merak.config.json'), JSON.stringify({
    $schema: 'https://unpkg.com/merak-compile/assets/schema.json',
    fakeGlobalVar: '',
  }))
})

cli.command('', 'parse all file to merak-format')
  .option('-c, --config', 'config file', {
    default: 'merak.config.json',
  })

  .action(async (options) => {
    let {
      dir = '', nativeVars = [], customVars = [], fakeGlobalVar, format = 'esm', isinLine = true, outDir = 'dist', includes = ['index.html', '**/*.js', '*.js', '**/*.css'], exclude = ['node_modules/**/*'], logPath,
    } = getConfig(options.config)
    if (!isVarName(fakeGlobalVar))
      throw new Error(`${fakeGlobalVar} is not a valid var`)

    const cwd = resolve(root, dir)
    fse.ensureDir(resolve(root, outDir))
    const entries = await fg(includes, { cwd, ignore: exclude })
    nativeVars = [...new Set([...DEFAULT_INJECT_GLOBALS, ...nativeVars])]
    console.table(entries)
    console.table(nativeVars)
    for (const entry of entries) {
      const filePath = resolve(root, outDir, entry)
      const raw = await fse.readFile(resolve(cwd, entry), 'utf-8')

      if (entry.endsWith('.js')) {
        if (format === 'esm') {
          const { code, warning } = injectGlobalToESM(raw, fakeGlobalVar, nativeVars, customVars)
          warning.forEach(warn => logger.collectDangerUsed(entry, warn.info, [warn.loc.start.line, warn.loc.start.column]))

          await fse.outputFile(filePath, code)
        }
        else {
          const { code, warning } = injectGlobalToIIFE(raw, fakeGlobalVar, nativeVars, customVars)
          warning.forEach(warn => logger.collectDangerUsed(entry, warn.info, [warn.loc.start.line, warn.loc.start.column]))

          await fse.outputFile(filePath, code)
        }
        if (logPath) {
          const unUsedGlobals = analyseJSGlobals(raw, [...nativeVars, ...customVars])
          unUsedGlobals.length > 0 && logger.collectUnusedGlobals(entry, unUsedGlobals)
        }

        return
      }

      if (entry.endsWith('.html')) {
        const merakConfig = {
          _f: fakeGlobalVar, _n: nativeVars, _c: customVars,
        } as any
        let html = raw.replace('</head>', `</head><script merak-ignore>const ${fakeGlobalVar}=window.${fakeGlobalVar}||window</script>`)
        merakConfig._l = analyseHTML(html)
        if (isinLine)
          html = html.replace('</body>', `<m-b config="${JSON.stringify(merakConfig)}"></m-b></body>`)
        else await fse.outputFile(resolve(filePath, '../merak.json'), JSON.stringify(merakConfig), 'utf-8')

        await fse.outputFile(filePath, html, 'utf-8')
        return
      }
      await fse.copyFile(resolve(cwd, entry), filePath)
    }
    logPath && logger.output(resolve(root, logPath))
  })

function getConfig(configPath: string) {
  /**
   * {
   *  "nativeVars":[...],
   * "customVars":[...],
   *  "fakeGlobalVar":'..'
   *  "dir":'..',
   *  "isInline":true/false,
   *  "format":esm/iife
   * }
   */
  return require(resolve(root, configPath))
}

cli.help()
cli.version(require('../package.json').version)

cli.parse()
