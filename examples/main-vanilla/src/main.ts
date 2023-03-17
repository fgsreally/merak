import { Merak } from 'merak-core'
import { PureLoader } from 'merak-core/loader'

const loader = new PureLoader()

const data = {
  data: 'data from main',
}
const app1 = new Merak('vite_react', 'http://127.0.0.1:4003/', { loader })
app1.preRender()

const app2 = new Merak('vite_vue', 'http://127.0.0.1:4004/', { loader })
app2.load()

window.app = app2
const app3 = new Merak('vue_cli', 'http://127.0.0.1:4005/', { loader })
app1.props = app2.props = app3.props = data
const el = document.createElement('button')
el.textContent = 'click to see the micro-app'
el.setAttribute('data-testid', 'btn')
el.onclick = () => {
  const el1 = document.createElement('merak-app')
  el1.setAttribute('data-merak-id', 'vite_react')
  const el2 = document.createElement('merak-app')
  el2.setAttribute('data-merak-id', 'vite_vue')
  const el3 = document.createElement('merak-app')
  el3.setAttribute('data-merak-id', 'vue_cli')
  document.body.append(el1, el2, el3)
}

document.body.appendChild(el)
