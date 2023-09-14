import type { Merak, NameSpace, Props } from 'merak-core'

export { Merak, Props, NameSpace }

export type MerakEvent = 'mount' | 'destroy' | 'hidden' | 'unmount' | 'relunch' | 'show'

const isMerak = !!window.isMerak

// get real window
export function $window(): Window {
  return isMerak ? window.rawWindow : window
}

export function $document(): Document {
  return $window().document
}

export function $history() {
  return $window().history
}
export function $location() {
  return $window().location
}
// the same as getInstance in merak-core
export function getInstance(id: string) {
  return $window().$MerakMap.get(id)
}

/**
 * @no_recommand 不建议使用
 */
export function $jump(project: string, to: string) {
  if (!isMerak)
    return
  const instance = getInstance(project)
  if (instance) {
    instance.proxyMap.history.pushState(null, '', to)
    const event = new PopStateEvent('popstate')
    instance.proxy.dispatchEvent(event)
  }
}

export function $eventName(event: string) {
  return `merak_${event}`
}

// sub app baseUrl
export function $base() {
  return isMerak ? $instance()!.url : location.origin
}

export function $body(): HTMLElement {
  return $document().body
}

export function $head(): HTMLHeadElement {
  return $document().head
}

export function $on(eventName: MerakEvent, cb: (flag?: string) => any): () => void {
  const event = $eventName(eventName)
  if (isMerak) {
    const callback = function (e: any) {
      cb(e.detail)
    }
    window.addEventListener(event, callback)
    return () => window.removeEventListener(event, callback)
  }
  return () => { }
}

export function $once(eventName: MerakEvent, cb: (flag?: string) => any): () => void {
  const event = $eventName(eventName)
  if (isMerak) {
    const callback = function (e: any) {
      cb(e.detail)
    }
    window.addEventListener(event, callback, { once: true })
    return () => window.removeEventListener(event, callback)
  }

  return () => { }
}

/**
 * $onMount $onUnmount $onExec run both in merak and individual app
 */

export function $onMount(cb: (flag?: string) => any) {
  return isMerak ? $on('mount', cb) : cb()
}

export function $onUnmount(cb: (flag?: 'destroy' | string) => any) {
  if (isMerak) {
    const fn = $on('unmount', cb)
    return fn
  }
  else {
    const callback = function (e: any) {
      cb(e.detail)
    }
    window.addEventListener('beforeunload', callback)
    return () => {
      window.removeEventListener('beforeunload', callback)
    }
  }
}

// work for eval
export function $sandbox(script: string) {
  if (isMerak) {
    const fakeGlobalVar = window.$Merak.fakeGlobalVar
    return `with(window.$MerakMap.get(${fakeGlobalVar}).proxy){${script}}`
  }

  else { return script }
}
// work for esm script
export function $esm(script: string) {
  if (isMerak) {
    const { fakeGlobalVar, nativeVars, customVars } = window.$Merak
    return `const {${nativeVars.reduce((p: string, c: string) => `${p},${c}`)}}=${fakeGlobalVar};${createCustomVarProxy(fakeGlobalVar, customVars)}\n${script}`
  }
  return script
}

function createCustomVarProxy(globalVar: string, customVars: string[]) {
  return customVars.map(item => `const ${item}=${globalVar}.__m_p__('${item}')`).reduce((p, c) => `${p + c};`, '')
}

export function $instance() {
  return window.$Merak as Merak
}

export function $props(): Props
export function $props<K extends keyof Props>(key: string): Props[K]
export function $props(key?: string) {
  return key ? $instance()?.props[key] : $instance().props as any
}

export function $namespace(): NameSpace
export function $namespace<K extends keyof NameSpace>(key: string): NameSpace[K]
export function $namespace(key?: string) {
  return key ? $instance()?.namespace[key] : $instance().namespace as any
}

export function $perf() {
  return $instance()?.perf
}

/**
 * @experiment
 */
export function $stopBubble(isPass = false) {
  if (isMerak) {
    ['click', 'mousemove', 'mousedown', 'mouseup', 'keydown', 'keyup'].forEach((eventName) => {
      document.body.addEventListener(eventName, (event) => {
        event.stopPropagation()
        if (isPass)
          $document().dispatchEvent(new CustomEvent(eventName, { detail: { isMerak: true, event } }))
      })
    })
  }
}
/**
 * Tell the host application that it's time to uninstall,
 */
export function $deactive() {
  $instance()?.deactive()
}

/**
 * @danger
 */
export function $destroy() {
  $instance()?.destroy()
}
