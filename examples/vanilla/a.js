export function test() {
  const el = document.createElement('div')
  el.innerText = 'vanilla'
  document.body.append(el)
  const c = eval('console.log(1)')
}
