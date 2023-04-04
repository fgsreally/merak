import { relative } from 'path'
import pc from 'picocolors'
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

  html = html.replace(/<merak-base[^>]+config=['"](.*)['"][\s>]<\/merak-base>/, (js, conf) => {
    config = JSON.parse(conf)
    return ''
  })
  return { html, config }
}

export function checkIsDanger(path: any, warning: any[]) {
  const { node, parent } = path
  if (DANGER_IDENTIFIERS.includes(node.name)) {
    warning.push({ info: `"${node.name}" is danger,need to be wrapped in Transformer`, loc: node.loc ! })
    return
  }
  if (node.name === 'Function' && parent.type === 'NewExpression')
    warning.push({ info: '"new Function()" is danger,need to be wrapped in Transformer', loc: node.loc ! })
}

export function createWarning(info: string, file: string, line: number, column: number) {
  if (process.env.DEBUG) {
    file = file.split('?')[0].replace(/\//g, '\\')
    // eslint-disable-next-line no-console
    console.log(pc.cyan('\n[merak-compile]') + pc.yellow(`${info} (${file}:${line}:${column})`))
  }
}
