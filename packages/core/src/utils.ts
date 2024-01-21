/* eslint-disable no-prototype-builtins */
// @internal
import { MerakMap } from './helper'

export function resolveUrl(filePath: string, baseURL: string) {
  return new URL(filePath, baseURL).href
}

export function getMerakQuerys() {
  const querys = location.search.slice(1)
  const queryMap: Record<string, string> = {}
  if (querys) {
    querys.split('&').forEach((item) => {
      const [key, value] = item.split('=')
      queryMap[key] = MerakMap.has(key) ? decodeURIComponent(value) : value
    })
  }
  return queryMap
}

export function createQuery(queryMap: Record<string, string>) {
  return Object.entries(queryMap).map(([k, v]) => `${k}=${MerakMap.has(k) ? encodeURIComponent(v) : v}`).join('&')
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

export function desctructGlobal(globals: string[]) {
  return globals.join(',')
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

export function scriptPromise(ele: HTMLScriptElement) {
  return new Promise<any>((resolve, reject) => {
    if (!ele.src)
      resolve(true)

    ele.addEventListener('load', resolve)
    ele.addEventListener('error', reject)
  })
}

export function createCustomVarProxy(globalVar: string, customVars: string[]) {
  return customVars.map(item => `const ${item}=${globalVar}.__m_p__('${item}')`).reduce((p, c) => `${p + c};`, '')
}

export function debug(info: string, id?: string) {
  if (process.env.NODE_ENV === 'development' && window.MERAK_DEBUG)
    // eslint-disable-next-line no-console
    console.debug(`[merak(${id})]:${info}`)
}
