import { resolve } from 'path'
import { parseSync, traverse } from '@babel/core'
import type { IText } from 'html5parser'
import { parse, walk } from 'html5parser'
import MagicString from 'magic-string'
import type { MerakAttrs, MerakHTMLFile, MerakJSFile } from './types'
import { desctructGlobal, isCdn, relativePath } from './utils'
export const analyseHTML = (code: string) => {
  const ast = parse(code)
  const ret = {
    type: 'html',
    filePath: '',
    scripts: [],
    links: {},
    dynamicImports: {},
  } as unknown as MerakHTMLFile

  walk(ast, {
    enter: (node) => {
      if (node.type === 'Tag') {
        if (node.name === 'script') {
          const outScriptNode = node.attributes.find(item => item.name.value === 'src')
          const merakAttrs = {} as unknown as MerakAttrs

          // node.attributes.filter(item => item.name.value.startsWith('data-merak-')).forEach((item) => {
          //   merakAttrs[item.name.value.slice(11)] = item.value?.value || true
          // })
          if (node.attributes.some(item => item.name.value === 'merak-ignore'))
            return
          node.attributes.filter(item => item.name.value !== 'src' && item.name.value !== 'merak-src').forEach((item) => {
            merakAttrs[item.name.value] = item.value?.value || true
          })
          // recording external script node to replace them in browser
          if (outScriptNode) {
            const merakSrc = node.attributes.find(item => item.name.value === 'merak-src')?.value?.value

            const { start, end } = node
            const { value: { value } } = outScriptNode as any
            ret.scripts.push({ filePath: merakSrc || value, loc: [start, end], merakAttrs, type: 'outline' })
          }
          else {
            const scriptType = node.attributes.find(item => item.name.value === 'type')?.value?.value
            const { start: tagStart, end: tagEnd } = node
            const { start } = node.close as IText
            const { end } = node.open
            switch (scriptType) {
              case undefined:

                ret.scripts.push({ loc: [tagStart, tagEnd], body: [end, start], type: 'iife', merakAttrs })
                break
              case 'module':

                ret.scripts.push({ loc: [tagStart, tagEnd], body: [end, start], type: 'esm', merakAttrs })
            }

            // TODO: inline script(esm||iife)
          }
        }

        // recording link node to replace publicpath in browser(useless in pure mode)

        if (node.name === 'link' && node.attributes.some(item => item.name.value === 'href')) {
          const outLinkNode = node.attributes.find(item => item.name.value === 'href')
          const { value: { start, end, value } } = outLinkNode as any
          ret.links[value] = { loc: [start, end] }
        }
      }
    },
  })
  return ret
}

export const analyseJSGlobals = (code: string, globals: string[]) => {
  const globalSet = new Set<string>()
  const globalUsed = new Set<string>()
  const ast = parseSync(code)
  traverse(ast, {
    // record all global variable
    Identifier(path) {
      const { scope } = path
      Object.keys((scope as any).globals).forEach((item) => {
        globalSet.add(item)
        globals.includes(item) && globalUsed.add(item)
      })
    },
    // static import
    //  relative path
  })

  return {
    globals: [...globalSet],
    globalUsed: [...globalUsed],
  }
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
  const ast = parseSync(code)

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

export function injectGlobalToIIFE(code: string, globalVar: string, globals: string[]) {
  const globalSet = new Set()
  const ast = parseSync(code, { filename: 'any' })
  const s = new MagicString(code)

  traverse(ast, {

    Identifier(path) {
      const { scope } = path
      Object.keys((scope as any).globals).forEach(item => globals.includes(item) && globalSet.add(item))
    },
    Program(path) {
      const { start, end } = path.node
      s.appendLeft(start || 0, `(()=>{const {${desctructGlobal(globals)}}=${globalVar};`)
      s.appendRight(end || 0, '})()')
    },
  })
  return { code: s.toString(), map: s.generateMap({ hires: true }) }
}

export function injectGlobalToESM(code: string, globalVar: string, globals: string[]) {
  const globalSet = new Set()
  const ast = parseSync(code)
  const s = new MagicString(code)
  let lastImport
  traverse(ast, {

    Identifier(path) {
      const { scope } = path
      Object.keys((scope as any).globals).forEach(item => globals.includes(item) && globalSet.add(item))
    },
    ImportDeclaration(path) {
      const { node } = path

      const { end } = node.source
      lastImport = end
    },
  })

  s.appendRight(lastImport || 0, `\nconst {${desctructGlobal(globals)}}=${globalVar};`)

  return { code: s.toString(), map: s.generateMap({ hires: true }) }
}
