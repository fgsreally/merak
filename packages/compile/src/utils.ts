import { relative } from 'path'
import { DANGER_IDENTIFIERS } from './common'
export function isCdn(str: string) {
  return !['.', '/'].includes(str.slice(0, 1))
}

export function relativePath(from: string, to: string) {
  return relative(from, to).replace(/\\/g, '/')
}
export function desctructGlobal(globals: string[]) {
  return globals.reduce((p, c) => `${p}${c},`, '')
}

export function resolveHtmlConfig(html: string) {
  let config

  html = html.replace(/<m-b[^>]+config=['"](.*)['"][\s>]<\/m-b>/, (js, conf) => {
    config = JSON.parse(conf)
    return ''
  })
  return { html, config }
}

export function checkIsDanger(node: any, warning: any[]) {
  if (DANGER_IDENTIFIERS.includes(node.name))
    warning.push({ info: `"${node.name}" is danger,need to be wrapped in $sandbox`, loc: node.loc ! })
}
export function resolveUrl(filePath: string, baseURL: string) {
  return new URL(filePath, baseURL).href
}
