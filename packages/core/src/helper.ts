import { Merak } from './merak'

export const MerakMap: Map<string, Merak> = window.$MerakMap || new Map()
window.$MerakMap = MerakMap

// 获得子元素对应实例
export function getInstance(id: string) {
  return MerakMap.get(id)
}

// 获得子应用对应的shadowroot 的host，可往其上插样式
export function getHost(id: string) {
  return getInstance(id)?.shadowRoot.host
}

// 获得子应用对应的url
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

export function $$jump(project: string, to: string) {
  const instance = getInstance(project)
  if (instance) {
    (instance.proxyMap.history as History).pushState(null, '', to)
    const event = new PopStateEvent('popstate')
    instance.proxy.dispatchEvent(event)
  }
}

export function $$namespace(): (typeof Merak)['namespace']
export function $$namespace<K extends keyof (typeof Merak)['namespace']>(key: string): (typeof Merak)['namespace'][K]
export function $$namespace(key?: string) {
  return key ? Merak.namespace[key] : Merak.namespace as any
}
