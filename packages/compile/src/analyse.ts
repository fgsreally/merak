/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { resolve } from 'path'
import { parseSync, traverse } from '@babel/core'
import type { SourceLocation } from '@babel/types'
import type { IText } from 'html5parser'
import { parse, walk } from 'html5parser'
import MagicString from 'magic-string'
import type { MerakJSFile } from './types'
import { checkIsDanger, desctructGlobal, isCdn, relativePath } from './utils'
export const analyseHTML = (code: string) => {
  const ast = parse(code)
  const ret = [] as [number, number][]

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
            if (!isCdn(value))
              ret.push([start + 1, end - 1])
            // ret._s.push({ _f: merakSrc || value, _tl: [start, end], _a: merakAttrs, _t: 'outline' })
          }
          else {
            const { start } = node.close as IText
            const { end } = node.open

            const source = code.slice(end, start)

            const { _l } = analyseInlineESM(source)
            _l.forEach(item => ret.push([end + item[0] + 1, end + item[1] - 1]))
          }
        }

        // recording link node to replace publicpath in browser(useless in pure mode)

        if (node.name === 'link' && node.attributes.some(item => item.name.value === 'href')) {
          const outLinkNode = node.attributes.find(item => item.name.value === 'href')
          const { value: { start, end, value } } = outLinkNode as any
          if (!isCdn(value))
            ret.push([start + 1, end - 1])
        }
      }
    },
  })
  return ret
}

export const analyseJSGlobals = (code: string, globalVars: string[]) => {
  const unUsedGlobalSet = new Set<string>()
  const ast = parseSync(code, { filename: 'any' }) as any
  traverse(ast, {
    // record all global variable
    Identifier(path) {
      const { scope } = path
      Object.keys((scope as any).globalVars || {}).forEach((item) => {
        (!globalVars.includes(item)) && unUsedGlobalSet.add(item)
      })
    },
    // static import
    //  relative path
  })

  return [...unUsedGlobalSet]
}

export function analyseInlineESM(code: string) {
  const importLoc = [] as [number, number][]
  const ast = parseSync(code) as any

  traverse(ast, {

    ImportDeclaration(path) {
      const { node } = path

      const { value, start, end } = node.source as any
      if (!isCdn(value))
        importLoc.push([start, end])
    },
    // dynamic import
    Import(path) {
      const { value, start, end } = (path.parent as any).arguments[0]
      if (!isCdn(value))
        importLoc.push([start, end])
    },

  })
  return { _l: importLoc }
}

/**
 * @deprecated
 */
export const analyseJS = (code: string, filePath: string, rootPath: string, globals: string[]) => {
  const ret = {
    type: 'js',
    filePath: relativePath(rootPath, filePath),
    imports: [],
    dynamicImports: {},
  } as unknown as MerakJSFile
  const ast = parseSync(code) as any

  const globalSet = new Set()
  traverse(ast, {
    // record all global variable
    Identifier(path) {
      const { scope } = path
      Object.keys((scope as any).globals).forEach(item => globals.includes(item) && globalSet.add(item))
    },
    // static import
    //  relative path
    ImportDeclaration(path) {
      const { node } = path

      const { value, start, end } = node.source as any
      if (isCdn(value))
        ret.imports.push({ filePath: '', loc: [start, end] })

      else
        ret.imports.push({ filePath: relativePath(rootPath, resolve(filePath, '../', value)), loc: [start, end] })
    },
    // dynamic import
    Import(path) {
      const { start, end } = path.parent as { start: number; end: number }
      const { value } = (path.parent as any).arguments[0]
      ret.dynamicImports[relativePath(rootPath, resolve(filePath, '../', value))] = { loc: [start, end] }
    },

  })
  ret.globals = [...globalSet] as string[]
  return ret
}

export function injectGlobalToIIFE(code: string, globalVar: string, nativeVars: string[],
  customVars: string[], force?: boolean) {
  const nativeSet = new Set<string>()
  const s = new MagicString(code)
  const warning: { info: string; loc: SourceLocation }[] = []

  let start = 0
  let end = 0
  if (force) {
    s.appendLeft(start, `(()=>{const {${desctructGlobal(nativeVars)}}=${globalVar};${createCustomVarProxy(globalVar, customVars)}`)
    s.append('})()')
  }
  else {
    const ast = parseSync(code, { filename: 'any' }) as any

    traverse(ast, {
      ReferencedIdentifier: (path) => {
        const name = path.node.name
        if (!path.scope.hasBinding(name, true)) {
          nativeVars.includes(name) && nativeSet.add(name)
          if (customVars.includes(name)) {
            const { start } = path.node || {}

            start && s.appendLeft(start, `${globalVar}.`)
          }
          checkIsDanger(path.node, warning)
        }
      },
      Program(path) {
        start = path.node.start as number
        end = path.node.end as number
      },
    })
    const injectGlobals = [...nativeSet]

    if (injectGlobals.length) {
      s.appendLeft(start, `(()=>{const {${desctructGlobal(injectGlobals)}}=${globalVar};`)
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
    s.prepend(createCustomVarProxy(globalVar, customVars))
    s.prepend(`\nconst {${desctructGlobal(nativeVars)}}=${globalVar};`)
  }
  else {
    const ast = parseSync(code) as any
    let lastImport
    traverse(ast, {
      ReferencedIdentifier: (path) => {
        const name = path.node.name

        if (!path.scope.hasBinding(name, true)) {
          nativeVars.includes(name) && nativeSet.add(name)
          if (customVars.includes(name)) {
            const { start } = path.node || {}
            start && s.appendLeft(start, `${globalVar}.`)
          }

          checkIsDanger(path.node, warning)
        }
      },

      ImportDeclaration(path) {
        const { node } = path
        const { end } = node.source
        lastImport = end
      },

    })

    const injectGlobals = [...nativeSet]
    // globals = injectGlobals
    if (injectGlobals.length)
      s.appendRight(lastImport || 0, `\nconst {${desctructGlobal(injectGlobals)}}=${globalVar};`)
  }
  return { code: s.toString(), map: s.generateMap({ hires: true }), warning }
}

export function createCustomVarProxy(globalVar: string, customVars: string[]) {
  return customVars.map(item => `const ${item}=${globalVar}.__m_p__('${item}')`).reduce((p, c) => `${p + c};`, '')
}
