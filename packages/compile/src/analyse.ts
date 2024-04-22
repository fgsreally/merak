import { parseSync, traverse } from '@babel/core'

import type { AcceptedPlugin } from 'postcss'
import postcss from 'postcss'
import type { IText } from 'html5parser'
import { parse, walk } from 'html5parser'
import { isCdn, isRelativeReferences } from './utils'

export function getImportLocFromJS(script: string) {
  const ast = parseSync(script)!
  const loc = [] as [number, number][]
  traverse(ast, {
    ImportDeclaration(path) {
      const { node } = path

      const { value, start, end } = node.source
      if (isRelativeReferences(value))
        loc.push([start! + 1, end! - 1])
    },
    // dynamic import
    Import(path) {
      const { value, start, end } = (path.parent as any).arguments[0]
      if (isRelativeReferences(value))
        loc.push([start + 1, end - 1])
    },

  })
  return loc
}

const URL_PATTERNS = [
  /url\(\s*['"]?([^"')]+)["']?\s*\)/,
  /AlphaImageLoader\(\s*src=['"]?([^"')]+)["']/,
]
const getPattern = (value: string) =>
  URL_PATTERNS.find(pattern => pattern.test(value))

export function getUrlLocFromCSS(style: string) {
  const loc = [] as [number, number][]

  // eslint-disable-next-line no-unused-expressions
  postcss([
    <AcceptedPlugin>{
      postcssPlugin: 'postcss-extract-url',
      Root(root) {
        root.walkDecls((decl) => {
          const pattern = getPattern(decl.value)
          const start = decl.source?.start?.offset

          if (pattern && start) {
            const match = pattern.exec(decl.toString())
            if (!match)
              return
            const from = start + match.index + match[0].indexOf(match[1])
            const to = from + match[1].length
            if (match)
              loc.push([from, to])
          }
        },
        )

        root.walkAtRules('import', (rule) => {
          const urlMatch = rule.params.match(URL_PATTERNS[0])
          let path = null
          let offset = rule.source!.start!.offset + rule.toString().indexOf(rule.params)
          if (urlMatch) {
            path = urlMatch[1]
            offset += urlMatch.index! + urlMatch[0].indexOf(urlMatch[1])
          }
          else {
            const match = rule.params.match(/["']([^"']+)["']/)
            if (match) {
              path = match[1]

              offset += match[0].indexOf(match[1])
            }
          }

          if (path)
            loc.push([offset, offset + path.length])
        })
      },
    },
  ]).process(style).css

  return loc
}

export function getPathLocFromHTML(html: string) {
  const loc = [] as [number, number][]
  const ast = parse(html)

  walk(ast, {
    enter: (node) => {
      if (node.type === 'Tag') {
        if (node.name === 'script') {
          const outScriptNode = node.attributes.some(item => item.name.value === 'src')
          if (node.attributes.some(item => item.name.value === 'merak-ignore'))
            return

          if (outScriptNode) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            const { start, end, value } = node.attributes.find(item => item.name.value === 'src')?.value!
            if (!isCdn(value))
              loc.push([start + 1, end - 1])
          }
          else {
            const { start } = node.close as IText
            const { end } = node.open
            const code = html.slice(end, start)
            loc.push(...formatLoc(end, getImportLocFromJS(code)))
          }
        }

        if (node.name === 'link' && node.attributes.some(item => item.name.value === 'href')) {
          const outLinkNode = node.attributes.find(item => item.name.value === 'href')
          const { value: { start, end, value } } = outLinkNode as any
          if (!isCdn(value))

            loc.push([start + 1, end - 1])
        }
        if (node.name === 'style') {
          const { start } = node.close as IText
          const { end } = node.open

          const code = html.slice(end, start)

          loc.push(...formatLoc(end, getUrlLocFromCSS(code)))
        }
      }
    },
  })

  return loc
}

function formatLoc(start: number, loc: [number, number][]) {
  return loc.map(([s, e]) => {
    return [start + s, start + e] as [number, number]
  }).sort((a, b) => a[0] - b[0])
}
