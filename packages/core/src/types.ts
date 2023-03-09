import type { EventType } from 'mitt'
import type { MerakHTMLFile } from 'merak-compile'
import type { Merak } from './merak'
// export interface SpaMerakConfig {
//   files: MerakFile[]

//   lazyFiles: {
//     [filePath: string]: MerakJSFile[]
//   }
// }

export interface MerakConfig {
  _t: MerakHTMLFile
  _g: string[]
  _f: string
}
// export interface SsrMerakConfig {
//   files: {
//     [filePath: string]: SpaMerakConfig
//   }
//   html: string
// }

export type lifecycle = (app: Merak) => any

export type ErrorHandler = (url: string) => any

export interface lifecycles {
  beforeLoad: lifecycle[]
  beforeMount: lifecycle[]
  afterMount: lifecycle[]
  beforeUnmount: lifecycle[]
  afterUnmount: lifecycle[]
  activated: lifecycle[]
  deactivated: lifecycle[]
}

export type merakEvent = Record<EventType, unknown>

export interface PreloadError {
  cmd: 'error'
  id: string
  filePath: string
}
export interface LoadDone {
  cmd: 'load'
  id: string
  url: string
  fakeGlobalName: string
  template: string
  // files: string[]
  // lazyFiles: string[]
  scripts: Record<string, any>[]
}

export interface PreLoadDone {
  cmd: 'preload'
  id: string
  filePath: string
  url: string
}

export interface ResolveDone {
  cmd: 'resolve'
  url: string
  id: string
}

export interface TransformDone {
  cmd: 'transform'
  code: string
  id: string
}

export type LoaderHookParam = LoadDone | PreloadError | ResolveDone | PreLoadDone | TransformDone

export interface MerakPlugin<LoaderInstance> {
  init?(loader: LoaderInstance): void
  resolve?(param: ResolveDone): void
  load?(param: LoadDone): void
  preload?(param: PreLoadDone): void
  error?(param: PreloadError): void
  transform?(param: TransformDone): string
  destroy?(loader: LoaderInstance): void
}

type ProxyObj = 'location' | 'history' | 'window' | 'document'

export type ProxyGlobals = {
  [key in ProxyObj]: ProxyHandler<any>
}

export interface RawProxyMap {
  location: Location
  history: History
  document: Document
  window: Window
}

export type MerakEvents = Record<EventType, unknown>

export type ProxyMap = Record<string, any> & RawProxyMap

export type CustomProxyHandler = (globals: ProxyGlobals) => ProxyGlobals
