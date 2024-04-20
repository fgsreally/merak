/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { resolve } from 'path'
import { parseSync, traverse } from '@babel/core'
import type { SourceLocation } from '@babel/types'
import type { IText } from 'html5parser'
import { parse, walk } from 'html5parser'
import MagicString from 'magic-string'
import type { MerakJSFile } from './types'
import { checkIsDanger, desctructVars, isCdn, isRelativeReferences, relativePath } from './utils'
import { EXCLUDE_TAG } from './common'

interface PathRecord {
  loc: [number, number]
  src: string

}
export const analyseHTML = (code: string) => {
  const ast = parse(code)
  const res = [] as PathRecord[]

  walk(ast, {
    enter: (node) => {
      if (node.type === 'Tag') {
        if (node.name === 'script') {
          const outScriptNode = node.attributes.some(item => item.name.value === 'src')

          if (node.attributes.some(item => item.name.value === 'merak-ignore'))
            return

          // recording external script node to replace them in browser
          if (outScriptNode) {
            const { start, end, value } = node.attributes.find(item => item.name.value === 'src')?.value!
            if (!isCdn(value)) {
              res.push({
                loc: [start + 1, end - 1],
                src: value,
              })
            }
            // ret._s.push({ _f: merakSrc || value, _tl: [start, end], _a: merakAttrs, _t: 'outline' })
          }
          else {
            const { start } = node.close as IText
            const { end } = node.open

            const source = code.slice(end, start)

            const inlineRes = analyseInlineESM(source)
            inlineRes.forEach(item => res.push({
              loc: [end + item.loc[0] + 1, end + item.loc[1] - 1],
              src: item.src,
            }))
          }
        }

        // recording link node to replace publicpath in browser(useless in pure mode)

        if (node.name === 'link' && node.attributes.some(item => item.name.value === 'href')) {
          const outLinkNode = node.attributes.find(item => item.name.value === 'href')
          const { value: { start, end, value } } = outLinkNode as any
          if (!isCdn(value)) {
            res.push({
              loc: [start + 1, end - 1],
              src: value,
            })
          }
        }
      }
    },
  })

  return res
}

export const getUnusedGlobalVariables = (code: string, globalVars: string[]) => {
  const unUsedGlobalSet = new Set<string>()
  const ast = parseSync(code, { filename: 'any' }) as any
  traverse(ast, {
    // record all global variable
    ReferencedIdentifier: (path) => {
      const name = path.node.name
      if (!path.scope.hasBinding(name, true))
        (!globalVars.includes(name)) && unUsedGlobalSet.add(name)
    },

    // static import
    //  relative path
  })

  return [...unUsedGlobalSet]
}

export function analyseInlineESM(code: string) {
  const res = [] as PathRecord[]
  const ast = parseSync(code) as any

  traverse(ast, {

    ImportDeclaration(path) {
      const { node } = path

      const { value, start, end } = node.source as any
      if (isRelativeReferences(value)) {
        res.push({
          loc: [start, end],
          src: value,
        })
      }
    },
    // dynamic import
    Import(path) {
      const { value, start, end } = (path.parent as any).arguments[0]
      if (isRelativeReferences(value)) {
        res.push({
          loc: [start, end],
          src: value,
        })
      }
    },

  })
  return res
}

/**
 * @deprecated
 */
// export const analyseJS = (code: string, filePath: string, rootPath: string, globals: string[]) => {
//   const ret = {
//     type: 'js',
//     filePath: relativePath(rootPath, filePath),
//     imports: [],
//     dynamicImports: {},
//   } as unknown as MerakJSFile
//   const ast = parseSync(code) as any

//   const globalSet = new Set()
//   traverse(ast, {
//     // record all global variable
//     Identifier(path) {
//       const { scope } = path
//       Object.keys((scope as any).globals).forEach(item => globals.includes(item) && globalSet.add(item))
//     },
//     // static import
//     //  relative path
//     ImportDeclaration(path) {
//       const { node } = path

//       const { value, start, end } = node.source as any
//       if (isRelativeReferences(value))
//         ret.imports.push({ filePath: '', loc: [start, end] })

//       else
//         ret.imports.push({ filePath: relativePath(rootPath, resolve(filePath, '../', value)), loc: [start, end] })
//     },
//     // dynamic import
//     Import(path) {
//       const { start, end } = path.parent as { start: number; end: number }
//       const { value } = (path.parent as any).arguments[0]
//       ret.dynamicImports[relativePath(rootPath, resolve(filePath, '../', value))] = { loc: [start, end] }
//     },

//   })
//   ret.globals = [...globalSet] as string[]
//   return ret
// }

export function injectGlobalToIIFE(code: string, globalVar: string, nativeVars: string[],
  customVars: string[], force?: boolean) {
  const nativeSet = new Set<string>()
  const s = new MagicString(code)
  const warning: { info: string; loc: SourceLocation }[] = []

  let start = 0
  let end = 0
  if (force) {
    s.appendLeft(start, `(()=>{const {${desctructVars(nativeVars)}}=${globalVar};${createCustomVarProxy(globalVar, customVars)}`)
    s.append('})()')
  }
  else {
    const ast = parseSync(code, { filename: 'any' }) as any

    traverse(ast, {
      ReferencedIdentifier: (path) => {
        const name = path.node.name
        if (!path.scope.hasBinding(name, true)) {
          checkIsDanger(path.node, warning)

          const { start } = path.node as { start: number }
          if (nativeVars.includes(name)) {
            if (s.slice(start! - 13, start!) === EXCLUDE_TAG) {
              s.overwrite(start, start + name.length, `(window.isMerak?window.rawWindow.${name}:${name})`)
              nativeSet.add('window')

              return
            }

            nativeSet.add(name)
          }
          if (customVars.includes(name))

            s.appendLeft(start, `${globalVar}.`)
        }
      },
      Program(path) {
        start = path.node.start as number
        end = path.node.end as number
      },
    })
    const injectGlobals = [...nativeSet]

    if (injectGlobals.length) {
      s.appendLeft(start, `(()=>{const {${desctructVars(injectGlobals)}}=${globalVar};`)
      s.appendRight(end, '})()')
    }
  }

  return { code: s.toString(), map: s.generateMap({ hires: true }), warning }
}

export function injectGlobalToESM(code: string,
  globalVar: string,
  nativeVars: string[],
  customVars: string[],
  force?: boolean) {
  const nativeSet = new Set<string>()

  const s = new MagicString(code)
  const warning: { info: string; loc: SourceLocation }[] = []

  if (force) {
    s.prepend(`\nconst {${desctructVars(nativeVars)}}=${globalVar};`)
    s.prepend(createCustomVarProxy(globalVar, customVars))
  }
  else {
    const ast = parseSync(code) as any
    // let lastImport
    traverse(ast, {
      ReferencedIdentifier: (path) => {
        const name = path.node.name

        if (!path.scope.hasBinding(name, true)) {
          checkIsDanger(path.node, warning)

          const { start } = path.node as { start: number }
          if (nativeVars.includes(name)) {
            if (start && s.slice(start! - 13, start!) === EXCLUDE_TAG) {
              s.overwrite(start, start + name.length, `(window.isMerak?window.rawWindow.${name}:${name})`)
              nativeSet.add('window')
              return
            }

            nativeSet.add(name)
          }

          if (customVars.includes(name))
            s.appendLeft(start, `${globalVar}.`)
        }
      },

    })

    const injectGlobals = [...nativeSet]
    // globals = injectGlobals
    if (injectGlobals.length)
      s.appendRight(0, `\nconst {${desctructVars(injectGlobals)}}=${globalVar};`)
  }
  return { code: s.toString(), map: s.generateMap({ hires: true }), warning }
}

export function compileStatement(code: string, globalVar: string) {
  const s = new MagicString(code)
  const ast = parseSync(code, { filename: 'any' }) as any
  traverse(ast, {
    ReferencedIdentifier: (path) => {
      const name = path.node.name
      if (!path.scope.hasBinding(name, true)) {
        const { start } = path.node as { start: number }
        s.appendRight(start, `${globalVar}.`)
      }
    },

  })

  return s.toString()
}

export function compileHTML(html: string, globalVar: string) {
  return html.replace(/<(\w+)([^>]*)>/g, (_, tag, attrs) => {
    return `<${tag}${(attrs as string).replace(/(on\w+)="([^"]*)"/g, (_, event, content) => {
      return `${event}="${compileStatement(content, globalVar)}"`
    })}>`
  })
}

// export function

export function createCustomVarProxy(globalVar: string, customVars: string[]) {
  return customVars.map(item => `const ${item}=${globalVar}.__m_p__('${item}')`).reduce((p, c) => `${p + c};`, '')
}
