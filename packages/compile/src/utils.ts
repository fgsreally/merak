import { relative } from 'path'
import { DANGER_IDENTIFIERS } from './common'
export function isCdn(str: string) {
  return !['.', '/'].includes(str.slice(0, 1))
}

export function relativePath(from: string, to: string) {
  return relative(from, to).replace(/\\/g, '/')
}
export function desctructGlobal(globals: string[]) {
  return globals.join(',')
}

export function resolveHtmlConfig(html: string) {
  let config

  html = html.replace(/<m-b[^>]+config=['"](.*)['"][\s>]<\/m-b>/, (js, conf) => {
    config = JSON.parse(decodeURIComponent(conf))
    return ''
  })
  return { html, config }
}
export function compileHTML(code: string, baseUrl: string, loc: [number, number][]) {
  const originStr = code
  let index = 0
  code = ''
  loc.forEach(([start, end]) => {
    code += originStr.slice(index, start)
    code += resolveUrl(originStr.slice(start, end), baseUrl)
    index = end
  })
  code += originStr.slice(index)
  return code
}

export function checkIsDanger(node: any, warning: any[]) {
  if (DANGER_IDENTIFIERS.includes(node.name))
    warning.push({ info: `"${node.name}" is danger,need to be wrapped in $sandbox`, loc: node.loc ! })
}
export function resolveUrl(filePath: string, baseURL: string) {
  return new URL(filePath, baseURL).href
}
