import fs from 'fs'
import { resolve } from 'path'
import { createRequire } from 'module'
import cac from 'cac'
import fg from 'fast-glob'
import isVarName from 'is-var-name'
import { DEFAULT_INJECT, analyseHTML, injectGlobalToESM, injectGlobalToIIFE } from 'merak-compile'
const cli = cac()
const require = createRequire(process.cwd())

cli
  .command('', 'parse all file to merak-format')
  .action(async () => {
    const {
      dir = '', globals, fakeGlobalName, format = 'esm', isinLine = true,
    } = getConfig()
    if (!isVarName(fakeGlobalName))
      throw new Error(`${fakeGlobalName} is not a valid var`)

    const cwd = resolve(process.cwd(), dir)
    const entries = await fg(['index.html', '**/*.js'], { cwd })
    const globalVars = [...new Set([...DEFAULT_INJECT, ...globals])]

    entries.forEach(async (entry) => {
      const filePath = resolve(cwd, entry)
      const raw = await fs.promises.readFile(filePath, 'utf-8')

      if (entry.endsWith('.js')) {
        if (format === 'esm')
          await fs.promises.writeFile(filePath, injectGlobalToESM(raw, fakeGlobalName, globalVars))

        else
          await fs.promises.writeFile(filePath, injectGlobalToIIFE(raw, fakeGlobalName, globalVars))
      }
      else {
        const merakConfig = {
          fakeGlobalName, globals: globalVars,
        }
        let html = raw.replace('</head>', `</head><script merak-ignore>const ${fakeGlobalName}=window.${fakeGlobalName}||window</script>`)
        merakConfig.template = analyseHTML(html)
        if (isinLine)
          html = html.replace('</body>', `<merak-base config="${JSON.stringify(merakConfig)}"></merak-base></body>`)
        else await fs.promises.writeFile(resolve(filePath, '../merak.json'), JSON.stringify(merakConfig), 'utf-8')

        await fs.promises.writeFile(filePath, html, 'utf-8')
      }
    })
  })

function getConfig() {
  /**
   * {
   *  "globals":[...],
   *  "fakeGlobalName":'..'
   *  "dir":'..',
   *  "isInline":true/false,
   *  "format":esm/iife
   * }
   */
  return require(resolve(process.cwd(), 'merak.config.json'))
}

cli.help()
cli.version(require('../package.json').version)

cli.parse()
