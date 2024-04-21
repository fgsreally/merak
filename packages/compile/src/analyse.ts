import { parseSync, traverse } from '@babel/core'

import type { AcceptedPlugin } from 'postcss'
import postcss from 'postcss'
import type { IText } from 'html5parser'
import { parse, walk } from 'html5parser'
import { isCdn, isRelativeReferences } from './utils'

export function getImportLocFromJS(script: string) {
  const ast = parseSync(script, { filename: 'any' }) as any
  const loc = [] as [number, number][]
  traverse(ast, {
    ImportDeclaration(path) {
      const { node } = path

      const { value, start, end } = node.source as any
      if (isRelativeReferences(value))
        loc.push([start, end])
    },
    // dynamic import
    Import(path) {
      const { value, start, end } = (path.parent as any).arguments[0]
      if (isRelativeReferences(value))
        loc.push([start, end])
    },

  })
  return loc
}

const URL_PATTERNS = [
  /(url\(\s*['"]?)([^"')]+)(["']?\s*\))/g,
  /(AlphaImageLoader\(\s*src=['"]?)([^"')]+)(["'])/g,
]
const getPattern = (value: string) =>
  URL_PATTERNS.find(pattern => pattern.test(value))

export function getUrlLocFromCSS(style: string) {
  const loc = [] as [number, number][]

  const { css } = postcss([
    <AcceptedPlugin>{
      postcssPlugin: 'postcss-extract-url',
      Root(root) {
        root.walkDecls((decl) => {
          const pattern = getPattern(decl.value)
          const start = decl.source?.start?.offset

          if (pattern && start) {
            const match = pattern.exec(decl.value)
            console.log('decl', pattern, decl.value, match)

            if (match)
              loc.push([start + match[1].indexOf(decl.value), start + match[1].indexOf(decl.value) + match[1].length])
          }
        },
        )
      },
    },
  ]).process(style)

  console.log(css)
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

          // recording external script node to replace them in browser
          if (outScriptNode) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            const { start, end, value } = node.attributes.find(item => item.name.value === 'src')?.value!
            if (!isCdn(value))
              loc.push([start + 1, end - 1])

            // ret._s.push({ _f: merakSrc || value, _tl: [start, end], _a: merakAttrs, _t: 'outline' })
          }
          else {
            const { start } = node.close as IText
            const { end } = node.open
            const code = html.slice(end, start)

            loc.push(...formatLoc(start, getImportLocFromJS(code)))
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
          console.log(code, formatLoc(start, getUrlLocFromCSS(code)))
          loc.push(...formatLoc(start, getUrlLocFromCSS(code)))
        }
      }
    },
  })

  return loc
}

function formatLoc(start: number, loc: [number, number][]) {
  return loc.map(([s, e]) => {
    return [start + s, start + e] as [number, number]
  })
}
