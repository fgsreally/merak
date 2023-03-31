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

export function getMerakEvent(event: string, id: string) {
  return `merak_${event}${id}`
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

// export function flow(...fns: CustomProxyHandler[]): CustomProxyHandler {
//   return (arg: ProxyGlobals) => {
//     for (const fn of fns)
//       arg = fn(arg)
//     return arg
//   }
// }
// export function noop(arg: any) {
//   return arg
// }

export function resolveHtmlConfig(html: string) {
  let config

  html = html.replace(/<merak-base[^>]+config=['"](.*)['"][\s>]<\/merak-base>/, (js, conf) => {
    config = JSON.parse(conf)
    return ''
  })
  return { html, config }
}

export function desctructGlobal(globals: string[]) {
  return globals.reduce((p, c) => `${p}${c},`, '')
}
