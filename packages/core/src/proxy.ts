/* eslint-disable no-prototype-builtins */
import { createQuery, debug, getMerakQuerys, isBoundedFunction, isCallable, isConstructable } from './utils'
import { getInstance } from './helper'
import { createProxyTimer } from './proxy/timer'
import { createProxyListener } from './proxy/listener'

export const cacheBindFn = new WeakMap()

// export const GLOBAL_VAR_SET = new Set()
// export const GLOBAL_VAR_MAP = new Map()
export const WINDOW_VAR_SET = new Set<PropertyKey>()

export function addWindowVar(variable: string) {
  WINDOW_VAR_SET.add(variable)
}

if (__DEV__) {
  // work for react
  addWindowVar('$RefreshSig$')
  addWindowVar('$RefreshReg$')
  // work for vue
  addWindowVar('__VUE_HMR_RUNTIME__')
  addWindowVar('__VUE_OPTIONS_API__')
}

export function getBindFn(target: any, p: any) {
  const value = target[p]
  if (cacheBindFn.has(value))
    return cacheBindFn.get(value)

  if (isCallable(value) && !isBoundedFunction(value) && !isConstructable(value)) {
    const boundValue = Function.prototype.bind.call(value, target)
    cacheBindFn.set(value, boundValue)

    for (const key in value)
      boundValue[key] = value[key]

    if (value.hasOwnProperty('prototype') && !boundValue.hasOwnProperty('prototype'))
      Object.defineProperty(boundValue, 'prototype', { value: value.prototype, enumerable: false, writable: true })

    return boundValue
  }

  return value
}

export function createProxyWindow(id: string, url: string) {
  return {
    get(target: any, p: PropertyKey) {
      const instance = getInstance(id)!

      debug(`get [${typeof p === 'symbol' ? p.toString() : p}] from window`, id)
      // if you want to rewrite proxy logic,don't remove this part
      /** start  */
      if (p === 'isMerak')
        return true

      if (p === '__merak_url__')
        return url
      if (p === '$Merak')
        return instance

      if (p === 'rawWindow')
        return window

      if (['self', 'window', 'globalThis'].includes(p as string))
        return instance.proxy

      if (p in instance.proxyMap)
        return instance.proxyMap[p as string]
      /** end  */

      return getBindFn(p in target ? target : window, p)
    },

    set(target: any, p: PropertyKey, v: any) {
      const instance = getInstance(id)!

      debug(`set [${typeof p === 'symbol' ? p.toString() : p}] to window`, id)

      if (WINDOW_VAR_SET.has(p)) {
        const iframe = instance.iframe
        if (iframe)
          iframe.contentWindow![p] = v

        else
          window[p] = v

        return true
      }
      target[p] = v
      return true
    },
    has: (target: any, p: string) => p in target || p in window,
  }
}

export function createProxyDocument(id: string, url: string) {
  return {
    // getPrototypeOf() {
    //   console.log(Object.getPrototypeOf(document))
    //   return Object.getPrototypeOf(document)
    // },
    get(target: any, p: PropertyKey) {
      debug(`get [${typeof p === 'symbol' ? p.toString() : p}] from document`, id)

      const instance = getInstance(id)!

      if (p === 'rawDocument')
        return document
      if (p === 'defaultView')
        return instance!.proxy
      // work for vite dev mode
      // to handle assets
      if (__DEV__) {
        if (p === 'createElement') {
          return (tagName: any, options?: ElementCreationOptions | undefined) => {
            const el = document.createElement(tagName, options)
            if (tagName === 'img') {
              const setAttribute = el.setAttribute
              el.setAttribute = (key: string, v: any) => {
                if (key === 'src')
                  v = new URL(v, url).href
                setAttribute.call(el, key, v)
              }
              Object.defineProperty(el, 'src', {

                configurable: true,
                set(v) {
                  el.setAttribute('src', v)
                },
                get() {
                  return el.getAttribute('src')
                },
              })
            }
            return el
          }
        }
      }
      if (p === 'activeElement')
        return instance!.sandHtml?.querySelector('body')

      if (p === 'documentURI' || p === 'URL')
        return (instance.proxyMap.location as Location).href

      if (p === 'querySelector')
        return instance.sandHtml!.querySelector.bind((instance.sandHtml as HTMLElement))

      if (
        p === 'getElementsByTagName'
        || p === 'getElementsByClassName'
        || p === 'getElementsByName' || p === 'getElementById'
      ) {
        return new Proxy(instance.sandHtml!.querySelectorAll, {
          apply(_, _ctx, args) {
            let arg = args[0] as string
            if (_ctx !== instance.proxyMap.document)
              // eslint-disable-next-line prefer-spread
              return _ctx[p].apply(_ctx, args)

            if (p === 'getElementsByTagName' && arg === 'script')
              return document.scripts

            if (p === 'getElementsByClassName')
              arg = `.${arg}`
            if (p === 'getElementsByName')
              arg = `[name="${arg}"]`

            if (p === 'getElementById') {
              arg = `#${arg}`
              return instance.sandHtml!.querySelector(arg)
            }
            return instance.sandHtml!.querySelectorAll(arg)
          },
        })
      }

      if (p === 'documentElement' || p === 'scrollingElement')
        return instance.sandHtml /** get shade in wujie */
      if (p === 'forms')
        return instance.sandHtml!.querySelectorAll('form')
      if (p === 'images')
        return instance.sandHtml!.querySelectorAll('img')
      if (p === 'links')
        return instance.sandHtml!.querySelectorAll('a')
      if (p === 'body' || p === 'head')
        return instance.sandHtml!.querySelector(p)

      return getBindFn(p in target ? target : document, p)
    },

    set(target: any, p: string, v: any) {
      target[p] = v
      return true
    },
    has: (target: any, p: string) => p in target || p in document,

  }
}

export function createProxyHistory(id: string) {
  return {
    get(target: any, p: PropertyKey) {
      debug(`get [${typeof p === 'symbol' ? p.toString() : p}] from history`, id)

      if (p === 'replaceState') {
        function replace(...args: [any, any, any]) {
          const { pathname, hash } = new URL(args[2], location.origin)
          const to = pathname + hash
          const queryMap = getMerakQuerys()
          queryMap[id] = to === '/undefined' ? '/' : to
          args[2] = `?${createQuery(queryMap)}${location.hash}`

          return history.replaceState(...args)
        }
        return replace
      }
      if (p === 'pushState') {
        function push(...args: [any, any, any]) {
          const { pathname, hash } = new URL(args[2], location.origin)

          const to = pathname + hash
          const queryMap = getMerakQuerys()
          queryMap[id] = to === '/undefined' ? '/' : to
          // work for hash
          // args[2] = `${location.hash.split('?')[0]}?${createQuery(queryMap)}`

          args[2] = `?${createQuery(queryMap)}${location.hash}`

          return history.pushState(...args)
        }
        return push
      }

      return getBindFn(p in target ? target : history, p)
    },
    set(target: any, p: string, v: any) {
      target[p] = v
      return true
    },
    has: (target: any, p: string) => p in history || p in target,

  }
}
export function createProxyLocation(id: string) {
  return {

    get(target: any, p: PropertyKey) {
      debug(`get [${typeof p === 'symbol' ? p.toString() : p}] from location`, id)

      const queryMap = getMerakQuerys()
      const appUrl = new URL((queryMap[id] === '/undefined' ? '/' : queryMap[id]) || '/', location.origin)

      if (
        p in appUrl
      )

        return appUrl[p]

      return getBindFn(p in target ? target : location, p)
    },
    set(target: any, p: string, v: any) {
      target[p] = v
      return true
    },
    has: (target: any, p: string) => p in target || p in location,

  }
}

export function createProxy(id: string, url: string) {
  const { setTimeout, setInterval } = createProxyTimer(id)
  return { document: createProxyDocument(id, url), window: createProxyWindow(id, url), history: createProxyHistory(id), location: createProxyLocation(id), setTimeout, setInterval, addEventListener: createProxyListener(id) }
}

export function createLibProxy(id: string, url: string) {
  return { document: createProxyDocument(id, url), window: createProxyWindow(id, url) }
}
