import type { EventType } from 'mitt'
import type { MerakHTMLFile } from 'merak-compile'

export interface MerakConfig {
  _t: MerakHTMLFile
  _g: string[]
  _f: string
}

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

export interface ProxyGlobals {
  window: ProxyHandler<Window>
  [key: string]: ProxyHandler<any>
}

export type MerakEvents = Record<EventType, unknown>
