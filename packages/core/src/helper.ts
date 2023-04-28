import type { Merak } from './merak'

export const MerakMap: Map<string, Merak> = window.$MerakMap || new Map()
window.$MerakMap = MerakMap

export function getInstance(id: string) {
  return MerakMap.get(id)
}

export function getHost(id: string) {
  return getInstance(id)?.shadowRoot.host
}

export function getUrl(id: string) {
  return (getInstance(id)?.proxyMap.location as Location)?.href
}

let MERAK_BODY_STYLE = 'position:relative'
export function setBodyStyle(style: string) {
  MERAK_BODY_STYLE = style
}

export function getBodyStyle() {
  return MERAK_BODY_STYLE
}
