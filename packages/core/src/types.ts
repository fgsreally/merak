export interface MerakConfig {
  _l: [number, number][]
  _n: string[]
  _c: string[]
  _f: string
}

export interface LoadDone {
  url: string
  fakeGlobalVar: string
  template: string
  nativeVars: string[]
  customVars: string[]

}

export interface ProxyGlobals {
  window: ProxyHandler<Window>
  [key: string]: ProxyHandler<any> | Function
}

export interface Props {
}

export interface NameSpace {
}
