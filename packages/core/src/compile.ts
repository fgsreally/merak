import { desctructGlobal, resolveUrl } from './utils'

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

export function compileScript(script: HTMLScriptElement, fakeGlobalVar: string, globalVars: string[]) {
  const { innerHTML, type } = script
  script.remove()
  if (innerHTML) {
    if (type === 'module')
      script.innerHTML = `const {${desctructGlobal(globalVars)}}=${fakeGlobalVar};\n${innerHTML}`

    else
      script.innerHTML = `(()=>{const {${desctructGlobal(globalVars)}}=${fakeGlobalVar};${innerHTML}\n})()`
  }
  return script
}
