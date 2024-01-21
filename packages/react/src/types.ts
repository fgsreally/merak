import type { ProxyFn } from 'merak-core'

export interface shareProps {
  name: string
  url: string
  props: any
  inlineStyle?: boolean

  proxy?: ProxyFn
  flag?: string
  iframe?: string
  timeout?: number
}
