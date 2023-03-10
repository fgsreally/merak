import { MERAK_EVENT_DESTROY, MERAK_EVENT_PREFIX } from './common'
import { getUrlQuery } from './utils'
import type { Merak } from './merak'
import { getInstance } from './composable'

const cacheBindFn = new WeakMap()

export function getBindFn(target: any, p: any) {
  const v = target[p]

  if (typeof v === 'function') {
    if (cacheBindFn.has(v))
      return cacheBindFn.get(v)

    const fn = v.bind(target)
    cacheBindFn.set(v, fn)
    return fn
  }

  return v
}

export function createProxyWindow(id: string, url: string) {
  return {
    get(target: any, p: string) {
      if (p === '__merak_url__')
        return url
      if (p === '$Merak')
        return getInstance(id)

      if (p === 'rawWindow')
        return window

      if (p === 'window' || p === 'self')
        return (getInstance(id) as Merak).proxy

      if (p in (getInstance(id) as Merak).proxyMap)
        return (getInstance(id) as Merak).proxyMap[p]

      // custom event
      if (p === 'addEventListener') {
        return (...params: Parameters<typeof addEventListener>) => {
          const eventName = params[0]

          if (eventName.startsWith(MERAK_EVENT_PREFIX)) {
            params[0] = eventName + id
          }
          else {
            addEventListener(MERAK_EVENT_DESTROY + id, () => {
              removeEventListener(...params)
            }, { once: true })
          }
          addEventListener(...params)
        }
      }

      return getBindFn(target, p) || getBindFn(window, p)
    },

    set(target: any, p: string, v: any) {
      return target[p] = v
    },
    has: (target: any, p: string) => p in target || p in window,

  }
}

export function createProxyDocument(id: string, url: string) {
  return {
    get(target: any, p: string) {
      const instance = getInstance(id) as Merak
      // work for vite dev mode
      // to handle assets
      if (DEV) {
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
        return instance.sandDocument?.querySelector('body')

      if (p === 'documentURI' || p === 'URL')
        return (instance as any).proxyMap.location.href

      if (p === 'querySelector')
        return (instance.sandDocument as HTMLElement).querySelector.bind((instance.sandDocument as HTMLElement))

      if (
        p === 'getElementsByTagName'
        || p === 'getElementsByClassName'
        || p === 'getElementsByName' || p === 'getElementById'
      ) {
        return new Proxy((instance.sandDocument as HTMLElement).querySelectorAll, {
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
              return instance.shadowRoot.querySelector(arg)
            }
            return instance.shadowRoot.querySelectorAll(arg)
          },
        })
      }

      if (p === 'documentElement' || p === 'scrollingElement')
        return instance.shadowRoot.firstElementChild
      if (p === 'forms')
        return instance.shadowRoot.querySelectorAll('form')
      if (p === 'images')
        return instance.shadowRoot.querySelectorAll('img')
      if (p === 'links')
        return instance.shadowRoot.querySelectorAll('a')
      if (p === 'body' || p === 'head')
        return instance.shadowRoot.querySelector(p)

      return getBindFn(target, p) || getBindFn(document, p)
    },

    set(target: any, p: string, v: any) {
      return target[p] = v
    },
    has: (target: any, p: string) => p in target || p in document,

  }
}

export function createProxyHistory(id: string) {
  return {
    get(target: any, p: string) {
      if (p === 'replaceState') {
        function replace(...args: [any, any, any]) {
          const { pathname, hash } = new URL(args[2], location.origin)
          const to = pathname + hash
          const queryMap = getUrlQuery(window.location.href)

          queryMap[id] = to === '/undefined' ? '/' : to
          args[2] = `?${encodeURIComponent(JSON.stringify(queryMap))}`
          // args[2] = `?${to === '/' ? '' : `test=${to}`}`
          return history.replaceState(...args)
        }
        return replace
      }
      if (p === 'pushState') {
        function push(...args: [any, any, any]) {
          const { pathname, hash } = new URL(args[2], location.origin)
          const to = pathname + hash
          const queryMap = getUrlQuery(window.location.href)
          queryMap[id] = to === '/undefined' ? '/' : to

          args[2] = `?${encodeURIComponent(JSON.stringify(queryMap))}`
          // args[2] = `?${to === '/' ? '' : `test=${to}`}`
          return history.pushState(...args)
        }
        return push
      }

      return getBindFn(target, p) || getBindFn(history, p)
    },
    set(target: any, p: string, v: any) {
      return target[p] = v
    },
    has: (target: any, p: string) => p in history || p in target,

  }
}
export function createProxyLocation(id: string) {
  return {

    get(target: any, p: string) {
      const { href } = window.location
      const queryMap = getUrlQuery(href)

      const appUrl = new URL(queryMap[id] === '/undefined' ? '/' : queryMap[id] || '/', location.origin)
      if (
        p in appUrl
      )

        return appUrl[p]

      return getBindFn(target, p) || getBindFn(location, p)
    },
    set(target: any, p: string, v: any) {
      return target[p] = v
    },
    has: (target: any, p: string) => p in target || p in location,

  }
}

export function createProxy(id: string, url: string) {
  return { document: createProxyDocument(id, url), window: createProxyWindow(id, url), history: createProxyHistory(id), location: createProxyLocation(id) }
}

export function createLibProxy(id: string, url: string) {
  return { document: createProxyDocument(id, url), window: createProxyWindow(id, url) }
}
