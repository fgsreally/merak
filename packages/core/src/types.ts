import type { Merak } from './merak'

export interface CompileInfo {
  n: string[]
  c: string[]
  p: string
  [key: string]: any
}

export interface LoadDone {
  url: string
  projectGlobalVar: string
  template: string
  nativeVars: string[]
  customVars: string[]

}

export type ProxyFactory = (instance: Merak) => ProxyGlobals

export interface ProxyGlobals {
  window: ProxyHandler<Window>
  [key: string]: ProxyHandler<any> | Function
}

export interface Props {
}

export interface NameSpace {
}
