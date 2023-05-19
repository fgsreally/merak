import { createCustomVarProxy, desctructGlobal, resolveUrl } from './utils'

export function compileHTML(code: string, baseUrl: string, loc: [number, number][]) {
  const originStr = code
  let index = 0
  code = ''
  loc.forEach(([start, end]) => {
    code += originStr.slice(index, start)
    code += resolveUrl(originStr.slice(start, end), baseUrl)
    index = end
  })
  code += originStr.slice(index)
  return code
}

export function cloneScript(script: HTMLScriptElement, fakeGlobalVar: string, nativeVars: string[], customVars: string[]) {
  const { src, async, defer, type, innerHTML } = script
  const newScriptEl = document.createElement('script')

  if (src)
    newScriptEl.src = src
  if (type)
    newScriptEl.type = type
  if (async)
    newScriptEl.async = async
  if (async)
    newScriptEl.defer = defer

  if (innerHTML) {
    const code = `const {${desctructGlobal(nativeVars)}}=${fakeGlobalVar};${createCustomVarProxy(fakeGlobalVar, customVars)}${innerHTML}`
    if (type === 'module')
      newScriptEl.innerHTML = code

    else
      script.innerHTML = `(()=>{${code}})()`
  }
  return newScriptEl
}
