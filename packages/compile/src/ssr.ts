import type { TransformCallback } from 'stream'
import { Transform } from 'stream'
import MagicString from 'magic-string'
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
    const ms = new MagicString(data)
    const length = data.length
    for (let i = 0; i < this.replacements.length; i++) {
      const start = this.replacements[i]
      if (start > this.index + length)
        break
      ms.appendLeft(start - this.index, this.url)
    }
    this.index += length

    this.push(ms.toString())
    callback()
  }
}
