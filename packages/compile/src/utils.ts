import { relative } from 'path'
export function isCdn(str: string) {
  return ['.', '/'].includes(str.slice(0, 1))
}

export function relativePath(from: string, to: string) {
  return relative(from, to).replace(/\\/g, '/')
}
export function desctructGlobal(globals: string[]) {
  return globals.reduce((p, c) => `${p}${c},`, '')
}
