/* eslint-disable no-console */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { PureLoader, preload } from 'merak-vue'

import App from './App.vue'
import router from './router'
import './assets/main.css'
preload('assets', 'vite_vue', 'http://localhost:4004', { loader: new PureLoader() })
const app = createApp(App)
app.use(createPinia())

app.use(router)

app.mount('#app')

document.addEventListener('click', (e) => {
  console.log(e.currentTarget, e.target)
  console.log('click')
})
