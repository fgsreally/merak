/* eslint-disable no-eval */
/* eslint-disable no-new-func */
export function test() {
  const el = document.createElement('div')
  el.innerText = 'vanilla'
  document.body.append(el)
  eval('console.log(document.body)')
  new Function('const d=10')('')
}
