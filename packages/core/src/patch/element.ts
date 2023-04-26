import { resolveUrl } from '../utils'

export function patchScript(elements: HTMLScriptElement[], baseURL: string) {
  elements.forEach((el) => {
    if (el.src)
      el.src = resolveUrl(el.src, baseURL)
  })
}

export function patchLink(elements: HTMLLinkElement[], baseURL: string) {
  elements.forEach((el) => {
    if (el.href)
      el.href = resolveUrl(el.href, baseURL)
  })
}
