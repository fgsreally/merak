import mitt from 'mitt'
import type { Merak } from './merak'

export const MerakMap: Map<string, Merak> = window.$MerakMap || new Map()
window.$MerakMap = MerakMap

export const bus = window.$MerakBus || mitt()
window.$MerakBus = bus

export function getInstance(id: string) {
  return MerakMap.get(id)
}

export function getHost(id: string) {
  return getInstance(id)?.shadowRoot.host
}

export function getUrl(id: string) {
  return getInstance(id)?.proxyMap.location?.href
}
