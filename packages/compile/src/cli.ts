import { resolve } from 'path'
import { createRequire } from 'module'
import fse from 'fs-extra'
import cac from 'cac'
import fg from 'fast-glob'
// @ts-expect-error misstypes
import isVarName from 'is-var-name'

import { DEFAULT_NATIVE_VARS } from './common'
import { logger } from './log'
import { Compiler } from './compiler'
const cli = cac('merak')
const root = process.cwd()
const require = createRequire(root)
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
    } = getConfig(options.config)
    if (!isVarName(projectGlobalVar))
      throw new Error(`"${projectGlobalVar}" is not a valid variable name`)
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

      if (/\.(js|mjs|cjs)/.test(entry)) {
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
      }
      else if (entry.endsWith('.html')) {
        await fse.outputFile(filePath, compiler.compileHTML(raw, entry).code)
      }

      else if (entry.endsWith('.css')) {
        await fse.outputFile(filePath, compiler.compileStyle(raw, entry).code)
      }

      else { await fse.copyFile(resolve(cwd, entry), filePath) }

      logger.log(`write file "${filePath}"`)
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
