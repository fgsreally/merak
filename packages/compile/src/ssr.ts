import type { TransformCallback } from 'stream'
import { Transform } from 'stream'
import { StringDecoder } from 'node:string_decoder'
import { Parser } from 'htmlparser2'
import { resolvePathInHTML, resolveUrl } from './utils'
import { analysePathInHTML } from './analyse'

function mergeAttrs(attrs: Record<string, string>) {
  return Object.entries(attrs).reduce((p, c) => `${p} ${c[0]}='${c[1]}'`, '')
}

/**
 * @deprecated
 */
export function wrap(html: string, url: string) {
  return `<template data-merak-url='${url}'>${html}</template>`
}

export function addMerakTagToHtml(main: string, sub: string, url: string, { tag = 'template', attrs = {} }: {
  tag?: string
  attrs?: Record<string, string>
} = {}) {
  const subHtml = resolvePathInHTML(sub, url, analysePathInHTML(sub).map(item => item.loc))

  return main.replace('</body>', `<${tag} data-merak-url='${url}'${mergeAttrs(attrs)}>${subHtml}</${tag}></body>`)
}

function isBuffer(_chunk: string | Buffer, encoding: string): _chunk is Buffer {
  return encoding === 'buffer'
}

/**
 * @todo resolve inner script
 */
export class SsrTransformer extends Transform {
  private readonly parser: Parser
  private readonly _decoder = new StringDecoder()
  tag: string
  constructor(public readonly url: string, opts: { attrs?: Record<string, string>; tag?: string } = {}) {
    super()

    const { attrs = {}, tag = 'template' } = opts

    this.tag = tag
    this.push(`<${tag} data-merak-url='${url}' ${mergeAttrs(attrs)}>`)
    this.parser = new Parser({
      onopentag: (tag, attrs) => {
        if ('merak-ignore' in attrs)
          return
        if (['link', 'a'].includes(tag) && 'href' in attrs)
          attrs.href = resolveUrl(attrs.href, url)

        if (['script', 'img', 'video', 'audio', 'iframe', 'source'].includes(tag) && 'src' in attrs)
          attrs.src = resolveUrl(attrs.src, url)

        const tagName = `<${tag}${mergeAttrs(attrs)}>`
        this.push(tagName)
      },
      onclosetag: (tag) => {
        const closeTag = `</${tag}>`
        this.push(closeTag)
      },
      ontext: (text) => {
        this.push(text)
      },
      onend: () => {
      },
    })
  }

  _flush(callback: TransformCallback): void {
    this.push(`</${this.tag}>`)
    callback()
  }

  _transform(chunk: any, encoding: string, callback: () => void) {
    this.parser.write(
      isBuffer(chunk, encoding) ? this._decoder.write(chunk) : chunk,
    )
    callback()
  }
}
