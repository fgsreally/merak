export interface MerakConfig {
  _l: [number, number][]
  _g: string[]
  _f: string
}

export interface LoadDone {
  cmd: 'load'
  id: string
  url: string
  fakeGlobalVar: string
  template: string

  globals: string[]

}

export interface TransformDone {
  cmd: 'transform'
  code: string
  id: string
}

export interface ErrorHandleDone {
  cmd: 'error'
  e: any
}

export type LoaderHookParam = LoadDone | TransformDone | ErrorHandleDone

export interface LoaderPlugin<Loader> {
  init?(loader: Loader): void
  errorHandler?(err: Error): any
  load?(param: LoadDone): void
  transform?(param: TransformDone): string
}

export interface ProxyGlobals {
  window: ProxyHandler<Window>
  [key: string]: ProxyHandler<any> | Function
}
