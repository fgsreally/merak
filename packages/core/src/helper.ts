import { Merak } from './merak'
import { eventTrigger } from './utils'

// 获得子元素对应实例
export function getApp(id: string) {
  return Merak.map.get(id)
}

// 获得子应用对应的shadowroot 的host，可往其上插样式
export function getHost(id: string) {
  return getApp(id)?.shadowRoot?.host
}

// 获得子应用对应的url
export function getUrl(id: string) {
  return (getApp(id)?.proxyMap.location as Location)?.href
}

export function $$jump(id: string, to: string, push = true) {
  const instance = getApp(id)
  if (instance) {
    (instance.proxyMap.history as History)[push ? 'pushState' : 'replaceState'](null, '', to)
    const event = new PopStateEvent('popstate')
    instance.proxy.dispatchEvent(event)
  }
}

export function $$namespace(): (typeof Merak)['namespace']
export function $$namespace<K extends keyof (typeof Merak)['namespace']>(key: string): (typeof Merak)['namespace'][K]
export function $$namespace(key?: string) {
  return key ? Merak.namespace[key] : Merak.namespace as any
}

export function $$emit(id: string, event: string, detail?: any) {
  eventTrigger(window, event + id, detail)
}

/**
 * @experiment
 */
export function handleEvent() {
  const listener = Element.prototype.addEventListener
  Element.prototype.addEventListener = (type: string, cb: any) => listener(type, (e) => {
    const { detail } = e as any
    if (detail.isMerak)
      return cb(detail.event)
    return cb(e)
  })
}
