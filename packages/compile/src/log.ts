import json2md from 'json2md'
import fse from 'fs-extra'
export class Logger {
  // work for DANGER_IDENTIFIERS
  dangerUsedRecord: Record<string, Record<string, { times: number; loc: [number, number] }>> = {}
  unusedGlobalRecord: Record<string, string[]> = {}

  collectDangerUsed(file: string, message: string, loc: [number, number]) {
    if (!this.dangerUsedRecord[file])
      this.dangerUsedRecord[file] = {}
    if (!this.dangerUsedRecord[file][message])
      this.dangerUsedRecord[file][message] = { times: 0, loc }
    this.dangerUsedRecord[file][message].times++
  }

  collectUnusedGlobals(file: string, globals: string[]) {
    this.unusedGlobalRecord[file] = globals
  }

  output(outputPath?: string) {
    if (!outputPath)
      return
    const ret = [] as any[]
    ret.push({ h1: 'danger used like eval:' })

    for (const file in this.dangerUsedRecord) {
      ret.push({ blockquote: `file:\`${file}\`` })
      for (const message in this.dangerUsedRecord[file]) {
        const { times, loc } = this.dangerUsedRecord[file][message]
        ret.push({ h3: `\`${message}\`` })

        ret.push({ ul: [`loc:\`${file}:${loc[0]}:${loc[1]}\``, `times: \`${times}\``] })
      }
    }

    ret.push({ h1: 'unused globals:' })

    for (const file in this.unusedGlobalRecord) {
      ret.push({ blockquote: `file:\`${file}\`` })
      ret.push({ ol: this.unusedGlobalRecord[file] })
    }
    // eslint-disable-next-line no-console
    console.log(`[MERAK] generate analyse file at ${outputPath}`)
    fse.outputFileSync(outputPath, json2md(ret))
  }
}

export const logger = new Logger()
