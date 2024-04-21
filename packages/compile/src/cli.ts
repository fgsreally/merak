import { resolve } from 'path'
import { createRequire } from 'module'
import fse from 'fs-extra'
import cac from 'cac'
import fg from 'fast-glob'
import postcss from 'postcss'
// @ts-expect-error misstypes
import isVarName from 'is-var-name'
import { merakPostCss } from './postcss'
import { analyseHTML, getUnusedGlobalVariables, injectGlobalToESM, injectGlobalToIIFE } from './analyse'
import { DEFAULT_NATIVE_VARS } from './common'
import { logger } from './log'
import { Compiler } from './compiler'
const cli = cac('merak')
const root = process.cwd()
const require = createRequire(root)
const styleReg = /<style[^>]*>[\s\S]*?<\/style>/gi
cli.command('init', 'create merak.config.json').action(() => {
  fse.outputFile(resolve(root, 'merak.config.json'), JSON.stringify({
    $schema: 'https://unpkg.com/merak-compile/assets/schema.json',
    projectGlobalVar: '',
  }))
})

cli.command('', 'parse all file to merak-format')
  .option('-c, --config', 'config file', {
    default: 'merak.config.json',
  })

  .action(async (options) => {
    let {
      dir = '', nativeVars = [], customVars = [], projectGlobalVar, format = 'esm', outDir = 'dist', includes = ['index.html', '**/*.js', '*.js', '**/*.css', '*.css'], exclude = ['node_modules/**/*'], logPath,
      loader = 'compile', output,
    } = getConfig(options.config)
    if (!isVarName(projectGlobalVar))
      throw new Error(`"${projectGlobalVar}" is not a valid variable name`)
    const cssHandler = postcss([merakPostCss()])
    const cwd = resolve(root, dir)
    fse.ensureDir(resolve(root, outDir))
    const entries = await fg(includes, { cwd, ignore: exclude })
    nativeVars = [...new Set([...DEFAULT_NATIVE_VARS, ...nativeVars])]
    logger.log('compile files:')
    console.table(entries)
    logger.log('native vars:')

    console.table(nativeVars)

    if (customVars.length) {
      logger.log('custom vars:')

      console.table(customVars)
    }

    const compiler = new Compiler(projectGlobalVar, nativeVars, customVars)
    for (const entry of entries) {
      const filePath = resolve(root, outDir, entry)
      const raw = await fse.readFile(resolve(cwd, entry), 'utf-8')

      if (entry.endsWith('.js')) {
        if (format === 'esm') {
          // const { code, warning } = injectGlobalToESM(raw, projectGlobalVar, nativeVars, customVars)
          // warning.forEach(warn => logger.collectDangerUsed(entry, warn.info, [warn.loc.start.line, warn.loc.start.column]))

          await fse.outputFile(filePath, compiler.compileESM(raw, entry).code)
        }
        else {
          // const { code, warning } = injectGlobalToIIFE(raw, projectGlobalVar, nativeVars, customVars)
          // warning.forEach(warn => logger.collectDangerUsed(entry, warn.info, [warn.loc.start.line, warn.loc.start.column]))

          await fse.outputFile(filePath, compiler.compileScript(raw, entry).code)
        }

        logger.log(`output file "${filePath}"`)

        if (logPath) {
          const unUsedGlobals = getUnusedGlobalVariables(raw, [...nativeVars, ...customVars])
          unUsedGlobals.length > 0 && logger.collectUnscopedVar(entry, unUsedGlobals)
        }

        continue
      }

      if (entry.endsWith('.html')) {
        const merakConfig = {
          _f: projectGlobalVar, _n: nativeVars, _c: customVars,
        } as any
        let html = raw.replace('</head>', `</head><script merak-ignore>const ${projectGlobalVar}=window.${projectGlobalVar}||window</script>`)
        if (loader === 'compile') {
          merakConfig._l = analyseHTML(html).map((item) => {
            logger.collectAction(`replace url "${item.src}"`)
            return item.loc
          })
        }

        if (!output)
          html = html.replace('</body>', `<merak c="${encodeURIComponent(JSON.stringify(merakConfig))}"></m-b></body>`)
        else await fse.outputFile(resolve(filePath, output), JSON.stringify(merakConfig), 'utf-8')
        logger.log(`output file "${filePath}"`)

        const matches = html.match(styleReg)
        if (matches) {
          for (const match of matches) {
            const start = match.indexOf('>') + 1
            const end = match.lastIndexOf('<')
            const { css } = await cssHandler.process(match.substring(start, end))
            html = html.replace(match, match.substring(0, start) + css + match.substring(end))
          }
        }

        await fse.outputFile(filePath, html, 'utf-8')
        continue
      }

      if (entry.endsWith('.css')) {
        const { css } = await cssHandler.process(raw)
        await fse.outputFile(filePath, css)
        logger.log(`output file "${filePath}"`)

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
   *  "projectGlobalVar":'..'
   *  "dir":'..',
   *  "isInline":true/false,
   *  "format":esm/iife,
   * }
   */
  return require(resolve(root, configPath))
}

cli.help()
cli.version(require('../package.json').version)

cli.parse()
