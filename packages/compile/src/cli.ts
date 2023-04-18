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

cli.command('detect', 'detect files global variable')
  .action(async () => {
    const {
      dir = '', globals, includes = ['index.html', '**/*.js', '*.js', '**/*.css'], exclude = ['node_modules/**/*'],
    } = getConfig()
    const cwd = resolve(root, dir)

    const entries = await fg(includes, { cwd, ignore: exclude })
    entries.forEach(async (entry) => {
      const raw = await fse.readFile(resolve(cwd, entry), 'utf-8')
      if (entry.endsWith('.js')) {
        const unUsedGlobals = analyseJSGlobals(raw, globals)
        logger.collectUnusedGlobals(entry, unUsedGlobals)
      }
    })
  })
cli
  .command('', 'parse all file to merak-format')
  .action(async () => {
    const {
      dir = '', globals, fakeGlobalVar, format = 'esm', isinLine = true, outDir = 'dist', includes = ['index.html', '**/*.js', '*.js', '**/*.css'], exclude = ['node_modules/**/*'],
    } = getConfig()
    if (!isVarName(fakeGlobalVar))
      throw new Error(`${fakeGlobalVar} is not a valid var`)

    const cwd = resolve(root, dir)
    fse.ensureDir(resolve(root, outDir))
    const entries = await fg(includes, { cwd, ignore: exclude })
    const globalVars = [...new Set([...DEFAULT_INJECT_GLOBALS, ...globals])]
    console.table(entries)
    console.table(globalVars)
    entries.forEach(async (entry) => {
      const filePath = resolve(root, outDir, entry)
      const raw = await fse.readFile(resolve(cwd, entry), 'utf-8')

      if (entry.endsWith('.js')) {
        if (format === 'esm')
          await fse.outputFile(filePath, injectGlobalToESM(raw, fakeGlobalVar, globalVars).code)

        else
          await fse.outputFile(filePath, injectGlobalToIIFE(raw, fakeGlobalVar, globalVars).code)

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
    })
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
