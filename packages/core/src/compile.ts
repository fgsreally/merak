import MagicString from 'magic-string'

import type { ImportFile, ImportScript, InlineScript } from 'merak-compile'
import { desctructGlobal, resolveUrl } from './utils'

export function compileGlobals(s: MagicString, globals: string[], insertPos: number, fakeGlobalVar: string) {
  s.appendRight(insertPos || 0, `\nconst {${desctructGlobal(globals)}}=${fakeGlobalVar};\n`)
  return s
}

export function compileStaticImports(s: MagicString, staticImport: ImportFile[], baseURL: string, urlMap: Map<string, string>) {
  for (const importInfo of staticImport) {
    const url = resolveUrl(importInfo.filePath, baseURL)
    const virtualUrl = urlMap.get(url)

    if (!virtualUrl)
      throw new Error(JSON.stringify({ stage: 'static-import', filePath: url, info: 'can\'t get file\'s virtual url ' }))
    const [start, end] = importInfo.loc

    s.overwrite(start, end, `"${virtualUrl}"`)
  }

  return s
}

export function compileDynamicImports(s: MagicString, dynamicImport: { [filePath in string]: { loc: [number, number] } }, projectID: string) {
  for (const i in dynamicImport) {
    const [start, end] = dynamicImport[i].loc
    s.overwrite(start, end, `$MerakImport('${i}','${projectID}')`)
  }

  return s
}

export function compileHTMLJS(s: MagicString, url: string, files: (ImportScript | InlineScript)[], globals: string[], fakeGlobalVar: string) {
  for (const file of files) {
    if (file._t !== 'outline') {
      const [tagStart, tagEnd] = (file as InlineScript)._b

      const body = new MagicString(s.slice(tagStart, tagEnd))
      for (const [start, end] of file._l) {
        const importer = body.slice(start + 1, end - 1)
        body.overwrite(start, end, `"${resolveUrl(importer, url)}"`)
      }
      if (file._t === 'esm')
        file._a.innerHTML = `\nconst {${desctructGlobal(globals)}}=${fakeGlobalVar};\n${body.toString()}`
      if (file._t === 'iife')
        file._a.innerHTML = `(()=>{const {${desctructGlobal(globals)}}=${fakeGlobalVar};${body.toString()}})()`
    }
    else {
      file._a.src = file._f
    }

    const [start, end] = file._tl
    s.overwrite(start, end, '')
  }
}

export function compileInlineJS(s: MagicString, scripts: { loc: [number, number]; type: 'esm' | 'iife' }[], globals: string[], fakeGlobalVar: string) {
  for (const script of scripts) {
    if (script.type === 'esm')
      s.appendRight(script.loc[0], `\nconst {${desctructGlobal(globals)}}=${fakeGlobalVar};\n`)

    if (script.type === 'iife') {
      s.appendRight(script.loc[0], `(()=>{const {${desctructGlobal(globals)}}=${fakeGlobalVar};\n`)
      s.appendLeft(script.loc[1], '})()')
    }
  }
  return s
}

export function compileCSSLink(s: MagicString, links: { [filePath in string]: { _l: [number, number] } }, baseURL: string) {
  for (const i in links) {
    const [start, end] = links[i]._l
    s.overwrite(start, end, `"${resolveUrl(i, baseURL)}"`)
  }
}
