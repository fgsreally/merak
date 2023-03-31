import { MERAK_DATA_FAKEGLOBALVAR, MERAK_DATA_ID } from './common'
import { Merak } from './merak'
import type { ProxyGlobals } from './types'

export function execScript(idAndName: string, url: string, proxy: ProxyGlobals) {
  if (!getInstance(idAndName)) {
  // eslint-disable-next-line @typescript-eslint/indent, no-new
  new Merak(idAndName, url, { proxy })
    const el = document.createElement('merak-block')
    el.setAttribute(MERAK_DATA_ID, idAndName)
    el.setAttribute(MERAK_DATA_FAKEGLOBALVAR, idAndName)
    document.body.appendChild(el)
  }

  return import(url)
}

export const MerakMap: Map<string, Merak> = window.$MerakMap || new Map()
window.$MerakMap = MerakMap

// export const bus = window.$MerakBus || mitt()
// window.$MerakBus = bus

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
