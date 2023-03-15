export interface SpaMerakConfig {
  files: MerakFile[]

  lazyFiles: {
    [filePath: string]: {
      files: MerakJSFile[]
      lazyFiles: string[]
    }
  }
}

// export interface MerakConfig {
//   template: MerakHTMLFile
//   fakeGlobalName: string
//   globals: string[]
// }
export interface SsrMerakConfig {
  files: {
    [filePath: string]: SpaMerakConfig
  }
  html: string
}

export interface MerakJSFile {
  type: 'js'
  filePath: string
  imports: ImportFile[]
  dynamicImports: { [filePath in string]: { loc: [number, number] } }
  globals: string[]
}

export interface MerakHTMLFile {
  // type (html)
  // fake
  _f: string
  // loc
  _l: { [filePath in string]: { _l: [number, number] } }
  // script
  _s: (ImportScript | InlineScript)[]
  // inlineScripts: (MerakAttrs & {
  //   type: 'esm' | 'iife'
  //   loc: [number, number]
  // })[]
  // dynamicImports: { [filePath in string]: { loc: [number, number] } }
}

export type ImportScript = MerakAttrs &
{ _t: 'outline'
  _f: string
  _tl: [number, number] }

export type InlineScript = MerakAttrs &
{ _t: 'esm' | 'iife'
  _b: [number, number]
  _tl: [number, number]
  _l: [number, number][]
}

export interface MerakAttrs {
  _a: Record<string, any>
}

export type MerakFile = MerakJSFile | MerakHTMLFile

export interface ImportFile {
  filePath: string
  loc: [number, number]
}

export interface MerakOptions {
  files: string[]
  globals: string[]
}
