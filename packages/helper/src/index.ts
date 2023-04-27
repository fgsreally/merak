import type { Merak as $Merak } from 'merak-core'

export type Merak = $Merak

export type MerakEvent = 'mount' | 'destroy' | 'hidden' | 'unmount' | 'relunch'

export function $window(): Window {
  return isMerak() ? window.rawWindow : window
}

export function $document(): Document {
  return isMerak() ? (document as any).rawDocument : document
}

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

export function $on(eventName: MerakEvent, cb: () => any) {
  const event = $eventName(eventName)
  if (isMerak())
    window.addEventListener(event, cb)
  return () => isMerak() && window.removeEventListener(event, cb)
}

export function $onMount(cb: () => any) {
  return isMerak() ? $on('mount', cb) : cb()
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
  $on('mount', cb)
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
