export type MerakEvent = 'mount' | 'destroy' | 'hidden' | 'unmount' | 'retry'

export function $window(): Window {
  return isMerak() ? window.rawWindow : window
}

export function $document(): Document {
  return isMerak() ? (document as any).rawDocument : document
}

export function getMerakEvent(event: string) {
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

export function $on(eventName: MerakEvent, cb: () => any) {
  const event = getMerakEvent(eventName)
  if (isMerak())
    window.addEventListener(event, cb)
  return () => isMerak() && window.removeEventListener(event, cb)
}

export function $onMount(cb: () => any) {
  return $on('mount', cb)
}

export function $onRetry(cb: () => any) {
  return $on('retry', cb)
}

export function $onHidden(cb: () => any) {
  return $on('hidden', cb)
}

export function $onDestroy(cb: () => any) {
  return $on('destroy', cb)
}

export function $onExec(cb: () => any) {
  $on('retry', cb)
  return cb()
}

// work for eval
export function $Transformer() {
  if (isMerak()) {
    const fakeGlobalVar = window.$Merak.fakeGlobalVar
    return (script: string) => `with(window.$MerakMap.get(${fakeGlobalVar}).proxy){${script}}`
  }

  else { return (script: string) => script }
}
