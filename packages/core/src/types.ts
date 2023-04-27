export interface MerakConfig {
  _l: [number, number][]
  _g: string[]
  _f: string
}

export interface LoadDone {
  url: string
  fakeGlobalVar: string
  template: string
  globals: string[]

}

export interface ProxyGlobals {
  window: ProxyHandler<Window>
  [key: string]: ProxyHandler<any> | Function
}
