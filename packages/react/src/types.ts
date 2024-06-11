import type { ProxyFactory } from 'merak-core'

export interface shareProps {
  name: string
  url: string
  props: any
  inlineStyle?: boolean

  proxy?: ProxyFactory
  flag?: string
  iframe?: string
  timeout?: number
}
