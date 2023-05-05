import type { Merak as $Merak } from 'merak-core'

export type Merak = $Merak

export type MerakEvent = 'mount' | 'destroy' | 'hidden' | 'unmount' | 'relunch'

export function $window(): Window {
  return isMerak() ? window.rawWindow : window
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

export function getInstance(id: string) {
  return $window().$MerakMap.get(id)
}

export function $jump(project: string, to: string) {
  const instance = getInstance(project)
  if (instance) {
    instance.proxyMap.history.pushState(null, '', to)
    const event = new PopStateEvent('popstate')
    instance.proxy.dispatchEvent(event)
  }
}

// function getQueryMap() {
//   return JSON.parse(decodeURIComponent($location().search.slice(1)),
//   )
// }

export function $eventName(event: string) {
  return `merak_${event}`
}

export function isMerak() {
  return !!window.isMerak
}

export function $body(): HTMLElement {
  return $document().body
}

export function $head(): HTMLHeadElement {
  return $document().head
}

export function $on(eventName: MerakEvent, cb: () => any): () => void {
  const event = $eventName(eventName)
  if (isMerak())
    window.addEventListener(event, cb)
  return () => isMerak() && window.removeEventListener(event, cb)
}

export function $once(eventName: MerakEvent, cb: () => any): () => void {
  const event = $eventName(eventName)
  if (isMerak())
    window.addEventListener(event, cb, { once: true })
  return () => isMerak() && window.removeEventListener(event, cb)
}

export function $onMount(cb: () => any) {
  return isMerak() ? $on('mount', cb) : cb()
}

// I don't sure if it is important
// export function $onShow(cb: () => any) {
//   return isMerak() ? $on('show', cb) : cb()
// }
export function $onRelunch(cb: () => any) {
  return $on('relunch', cb)
}

export function $onHidden(cb: () => any) {
  return $on('hidden', cb)
}

export function $onDestroy(cb: () => any) {
  return $on('destroy', cb)
}

export function $onUnmount(cb: () => any) {
  const fn1 = $once('hidden', cb)
  const fn2 = $on('destroy', cb)
  return () => {
    fn1()
    fn2()
  }
}

export function $onExec(cb: () => any) {
  if (!isMerak())
    cb()
  const fn1 = $once('mount', cb)
  const fn2 = $on('relunch', cb)
  return () => {
    fn1()
    fn2()
  }
}

// work for eval
export function $sandbox(script: string) {
  if (isMerak()) {
    const fakeGlobalVar = window.$Merak.fakeGlobalVar
    return `with(window.$MerakMap.get(${fakeGlobalVar}).proxy){${script}}`
  }

  else { return script }
}
// work for esm script
export function $esm(script: string) {
  if (isMerak()) {
    const { fakeGlobalVar, globalVars } = window.$Merak
    return `const {${globalVars.reduce((p: string, c: string) => `${p},${c}`)}}=${fakeGlobalVar};${script}`
  }
  return script
}

export function $instance() {
  return window.$Merak as undefined | $Merak
}

export function $props<T = Record<string, any>>(): undefined | T {
  return $instance()?.props
}

export function $namespace() {
  return $instance()?.namespace
}

export function $perf() {
  return $instance()?.perf
}

export function $stopProp() {
  if (isMerak()) {
    ['click', 'mousemove', 'mousedown', 'mouseup', 'keydown', 'keyup'].forEach((eventName) => {
      document.body.addEventListener(eventName, (event) => {
        event.stopPropagation()
      })
    })
  }
}
