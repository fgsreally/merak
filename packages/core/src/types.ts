export interface AppConfig {
  _n: string[]
  _c: string[]
  _f: string
  [key: string]: any
}

export interface LoadDone {
  url: string
  fakeGlobalVar: string
  template: string
  nativeVars: string[]
  customVars: string[]

}

export type ProxyFn = (opts: { id: string; baseUrl: string }) => ProxyGlobals

export interface ProxyGlobals {
  window: ProxyHandler<Window>
  [key: string]: ProxyHandler<any> | Function
}

export interface Props {
}

export interface NameSpace {
}
