import json2md from 'json2md'
import fse from 'fs-extra'
import pc from 'picocolors'
export class Logger {
  // work for DANGER_IDENTIFIERS
  dangerUsedRecord: Record<string, Record<string, { times: number; loc: [number, number] }>> = {}
  unusedGlobalRecord: Record<string, string[]> = {}
  actionRecord: string[] = []
  collectDangerUsed(file: string, message: string, loc: [number, number]) {
    if (!this.dangerUsedRecord[file])
      this.dangerUsedRecord[file] = {}
    if (!this.dangerUsedRecord[file][message])
      this.dangerUsedRecord[file][message] = { times: 0, loc }
    this.dangerUsedRecord[file][message].times++
  }

  collectUnscopedVar(file: string, variable: string) {
    if (!this.unusedGlobalRecord[file])
      this.unusedGlobalRecord[file] = []
    if (!this.unusedGlobalRecord[file].includes(variable))
      this.unusedGlobalRecord[file].push(variable)
  }

  collectAction(value: string) {
    this.actionRecord.push(value)
  }

  log(info: string) {
    // eslint-disable-next-line no-console
    console.log(`${pc.cyan('[MERAK]')} ${info}`)
  }

  output(outputPath?: string) {
    if (!outputPath)
      return

    const ret = [] as any[]

    ret.push({ h1: 'Action Info:' })
    ret.push({ ol: this.actionRecord })

    ret.push({ h1: 'Danger used like `eval`:' })

    for (const file in this.dangerUsedRecord) {
      ret.push({ blockquote: `file:\`${file}\`` })
      for (const message in this.dangerUsedRecord[file]) {
        const { times, loc } = this.dangerUsedRecord[file][message]
        ret.push({ h3: `\`${message}\`` })

        ret.push({ ul: [`loc:\`${file}:${loc[0]}:${loc[1]}\``, `times: \`${times}\``] })
      }
    }

    ret.push({ h1: 'Unused globals:' })

    for (const file in this.unusedGlobalRecord) {
      ret.push({ blockquote: `file:\`${file}\`` })
      ret.push({ ol: this.unusedGlobalRecord[file] })
    }
    this.log(`generate log file at ${outputPath}`)
    fse.outputFileSync(outputPath, json2md(ret))
  }
}

// export const logger = new Logger()
