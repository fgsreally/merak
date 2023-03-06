/// <reference types="vite/client" />
import './style.css'
import { MERAK_DATA_ID, Merak } from 'merak-core'
// import Worker from './worker?worker'
import { PureLoader } from 'merak-core/loader'

const loader = new PureLoader()

const app = new Merak('vite_vue', 'http://localhost:3000/', loader)

// const worker = new Worker()

// createWorkerApp(app, worker)

async function mount() {
  const webComponent = document.createElement('merak-app')
  webComponent.setAttribute(MERAK_DATA_ID, 'vite_vue')

  await app.load()

  webComponent.classList.add('fgs')
  document.body.appendChild(webComponent)
  // injectStyle('fgs', '.details{display:none}')
}
mount()
