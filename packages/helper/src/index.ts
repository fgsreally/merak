import type { Merak as $Merak } from 'merak-core'

export type Merak = $Merak

export type MerakEvent = 'mount' | 'destroy' | 'hidden' | 'unmount' | 'relunch'

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

export function $onRelunch(cb: () => any) {
  return $on('relunch', cb)
}

export function $onHidden(cb: () => any) {
  return $on('hidden', cb)
}

export function $onDestroy(cb: () => any) {
  return $on('destroy', cb)
}

export function $onExec(cb: () => any) {
  cb()
  return $on('relunch', cb)
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
