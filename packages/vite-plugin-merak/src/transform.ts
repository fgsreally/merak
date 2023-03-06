import { replace, replaceQuotes, replaceUrl } from './utils'

export interface TransformOptions {
  base: string
  publicPath: string
  assetsDir: string
}

export function transformChunk(format: 'system' | 'es', code: string, options: TransformOptions) {
  const { base, publicPath } = options
  let content = replaceQuotes(base, publicPath, code)
  if (format === 'system') {
    // replace css url
    content = replaceUrl(base, publicPath, content)
  }
  return content
}

export function transformAsset(code: string, options: TransformOptions) {
  const { assetsDir, base } = options
  let content = replace(`${base}${assetsDir}/`, '', code)
  content = replace(base, '', content)
  return content
}

export function transformHtml(html: string, options: TransformOptions) {
  const { base } = options
  const content = replace(base, '/', html)
  return content
}
