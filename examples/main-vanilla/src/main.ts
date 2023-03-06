import { Merak } from 'merak-core'
import { PureLoader } from 'merak-core/loader'

const loader = new PureLoader()
const app1 = new Merak('vue_cli'/** 子应用name */, 'http://127.0.0.1:8080/', { loader })
app1.preRender()
const app2 = new Merak('vite_vue', 'http://127.0.0.1:5173/', { loader })
app2.load()

const el = document.createElement('button')
el.textContent = 'click to see the micro-app'
el.onclick = () => {
  const el1 = document.createElement('merak-app')
  el1.setAttribute('data-merak-id', 'vue_cli')
  const el2 = document.createElement('merak-app')
  el2.setAttribute('data-merak-id', 'vite_vue')
  document.body.append(el1, el2)
}

document.body.appendChild(el)
