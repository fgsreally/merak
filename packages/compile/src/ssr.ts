import type { TransformCallback } from 'stream'
import { Transform } from 'stream'
export class MerakSsrStream extends Transform {
  index = 0
  replacements: number[]
  url: string
  setConfig(params: { replacements: number[]; url: string }) {
    this.url = params.url
    this.replacements = params.replacements
  }

  _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
    const data = chunk.toString()
    let str = ''
    const length = data.length
    let loc = 0
    for (let i = 0; i < this.replacements.length; i++) {
      const start = this.replacements[i]
      if (start > this.index + length) {
        str += data.slice(loc)
        break
      }
      str += data.slice(loc, start) + this.url
      loc = start
    }
    this.index += length

    this.push(str)
    callback()
  }
}
