import { Transform } from 'stream'
import { Parser } from 'htmlparser2'
import { resolveUrl } from './utils'

function mergeAttrs(attrs: Record<string, string>) {
  return Object.entries(attrs).reduce((p, c) => `${p} ${c[0]}='${c[1]}'`, '')
}

export function wrap(html: string, url: string) {
  return `<template data-merak-url='${url}'>${html}</template>`
}
export class SsrTransformer extends Transform {
  private parser: Parser
  constructor(public readonly url: string, public templateAttrs: Record<string, string> = {}) {
    super()
    this.push(`<template data-merak-url='${url}' ${mergeAttrs(templateAttrs)}>`)
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
        this.push('</template>')
      },
    })
  }

  _transform(chunk: any, encoding: string, callback: () => void) {
    this.parser.write(chunk.toString())
    callback()
  }
}
