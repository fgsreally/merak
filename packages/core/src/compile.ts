import { createCustomVarProxy, desctructVars } from './utils'

export function cloneScript(script: HTMLScriptElement, projectGlobalVar: string, nativeVars: string[], customVars: string[]) {
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
    const code = `const {${desctructVars(nativeVars)}}=${projectGlobalVar};${createCustomVarProxy(projectGlobalVar, customVars)}${innerHTML}`
    if (type === 'module')
      newScriptEl.innerHTML = code

    else
      script.innerHTML = `(()=>{${code}})()`
  }
  return newScriptEl
}
