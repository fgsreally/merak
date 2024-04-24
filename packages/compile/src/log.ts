import json2md from 'json2md'
import fse from 'fs-extra'

export enum LOG_LELVEL {
  INFO = 0,
  LOG = 1,
  WARN = 2,
  ERROR = 3,
}

export class Logger {
  protected filesInfo = {} as Record<string, Set<string>>
  level: number
  constructor() {
    this.level = Number(process.env.MERAK_LOG_LEVEL || 1)
  }

  add(msg: string, file: string, level = 1) {
    if (this.level > level)
      return
    if (!this.filesInfo[file])
      this.filesInfo[file] = new Set()

    this.filesInfo[file].add(msg)
  }

  info(info: string) {
    if (this.level <= LOG_LELVEL.INFO)

    // eslint-disable-next-line no-console
      console.info(`\x1B[38;2;255;165;0m[MERAK] \x1B[90m${info}\x1B[0m`)
  }

  log(info: string) {
    if (this.level <= LOG_LELVEL.LOG)
    // eslint-disable-next-line no-console
      console.log(`\x1B[38;2;255;165;0m[MERAK] \x1B[32m${info}\x1B[0m`)
  }

  warn(info: string) {
    if (this.level <= LOG_LELVEL.WARN)

      console.warn(`\x1B[38;2;255;165;0m[MERAK] \x1B[33m${info}\x1B[0m`)
  }

  error(info: string) {
    if (this.level <= LOG_LELVEL.ERROR)
      console.error(`\x1B[38;2;255;165;0m[MERAK] \x1B[31m${info}'\x1B[0m`)
  }

  output(outputPath: string) {
    if (!outputPath)
      return

    const ret = [] as any[]
    ret.push({ h1: '`MERAK DEBUG INFO`' })

    for (const file in this.filesInfo) {
      ret.push({ h2: `file:\`${file}\`` })
      ret.push({ ol: [...this.filesInfo[file]] })
    }
    fse.outputFileSync(outputPath, json2md(ret))
    this.log(`generate log file at ${outputPath}`)
  }
}

export const logger = new Logger()
