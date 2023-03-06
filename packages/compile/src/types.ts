export interface SpaMerakConfig {
  files: MerakFile[]

  lazyFiles: {
    [filePath: string]: {
      files: MerakJSFile[]
      lazyFiles: string[]
    }
  }
}

export interface MerakConfig {
  template: MerakHTMLFile
  fakeGlobalName: string
  globals: string[]
}
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
  type: 'html'
  filePath: string
  links: { [filePath in string]: { loc: [number, number] } }
  scripts: (ImportScript | InlineScript)[]
  // inlineScripts: (MerakAttrs & {
  //   type: 'esm' | 'iife'
  //   loc: [number, number]
  // })[]
  // dynamicImports: { [filePath in string]: { loc: [number, number] } }
}

export type ImportScript = MerakAttrs &
{ type: 'outline'
  filePath: string
  loc: [number, number] }

export type InlineScript = MerakAttrs &
{ type: 'esm' | 'iife'
  body: [number, number]
  loc: [number, number] }

export interface MerakAttrs {
  merakAttrs: Record<string, any>
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
