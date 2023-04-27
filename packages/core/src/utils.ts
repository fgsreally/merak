/* eslint-disable no-prototype-builtins */
export async function loadJSONFile(url: string) {
  const res = await fetch(url)
  return res.json()
}
export async function loadTextFile(url: string) {
  const res = await fetch(url)
  return res.text()
}

// export function createUrl(code: string, type = 'text/javascript') {
//   const blob = new Blob([code], { type })
//   return URL.createObjectURL(blob)
// }
export function resolveUrl(filePath: string, baseURL: string) {
  return new URL(filePath, baseURL).href
}

export function getUrlQuery(url: string) {
  const query = url.split('?')[1]
  return query ? JSON.parse(decodeURIComponent(query)) : {}
}

/**
 * 模拟unload等自定义事件
 */
export function eventTrigger(el: HTMLElement | Window | Document, eventName: string, detail?: any) {
  let event
  if (typeof window.CustomEvent === 'function') {
    event = new CustomEvent(eventName, { detail })
  }
  else {
    event = document.createEvent('CustomEvent')
    event.initCustomEvent(eventName, true, false, detail)
  }
  el.dispatchEvent(event)
}

export function resolveHtmlConfig(html: string) {
  let config

  html = html.replace(/<m-b[^>]+config=['"](.*)['"][\s>]<\/m-b>/, (js, conf) => {
    config = JSON.parse(decodeURIComponent(conf))
    return ''
  })
  return { html, config }
}

export function desctructGlobal(globals: string[]) {
  return globals.reduce((p, c) => `${p}${c},`, '')
}

const boundedMap = new WeakMap<CallableFunction, boolean>()
export function isBoundedFunction(fn: CallableFunction) {
  if (boundedMap.has(fn))
    return boundedMap.get(fn)

  const bounded = fn.name.indexOf('bound ') === 0 && !fn.hasOwnProperty('prototype')
  boundedMap.set(fn, bounded)
  return bounded
}

const fnRegexCheckCacheMap = new WeakMap<any | FunctionConstructor, boolean>()
export function isConstructable(fn: () => any | FunctionConstructor) {
  const hasPrototypeMethods
    = fn.prototype && fn.prototype.constructor === fn && Object.getOwnPropertyNames(fn.prototype).length > 1

  if (hasPrototypeMethods)
    return true

  if (fnRegexCheckCacheMap.has(fn))
    return fnRegexCheckCacheMap.get(fn)

  let constructable = hasPrototypeMethods
  if (!constructable) {
    const fnString = fn.toString()
    const constructableFunctionRegex = /^function\b\s[A-Z].*/
    const classRegex = /^class\b/
    constructable = constructableFunctionRegex.test(fnString) || classRegex.test(fnString)
  }

  fnRegexCheckCacheMap.set(fn, constructable)
  return constructable
}

const callableFnCacheMap = new WeakMap<CallableFunction, boolean>()

const naughtySafari = typeof document.all === 'function' && typeof document.all === 'undefined'

export const isCallable = (fn: any) => {
  if (callableFnCacheMap.has(fn))
    return true

  const callable = naughtySafari ? (typeof fn === 'function' && typeof fn !== 'undefined') : typeof fn === 'function'
  if (callable)
    callableFnCacheMap.set(fn, callable)

  return callable
}

export function scriptPrimise(script: HTMLScriptElement) {
  return new Promise((resolve, reject) => {
    script.addEventListener('load', resolve)
    script.addEventListener('error', reject)
  })
}
