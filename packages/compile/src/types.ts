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
//   fakeGlobalVar: string
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
  // fakeGlobalVar
  _f: string
  _g: string[]
  // link
  _l: [number, number][]
  // script
  // _s: (ImportScript | InlineScript)[]

}

export type ImportScript = MerakAttrs &
{ // type
  _t: 'outline'
  // filepath
  _f: string
  // tag loc
  _tl: [number, number] }

export type InlineScript = MerakAttrs &
{ // type
  _t: 'esm' | 'iife'
  // content loc
  _b: [number, number]
  // tag loc
  _tl: [number, number]
  // import loc
  _l: [number, number][]
}

export interface MerakAttrs {
  // attrs
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
