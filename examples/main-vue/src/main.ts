/* eslint-disable no-console */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import { CompileLoader, preload } from 'merak-vue'
// preload('assets', 'vite_vue', 'http://localhost:4004', { loader: new CompileLoader() })

import App from './App.vue'
import router from './router'
import './assets/main.css'
const app = createApp(App)
app.use(createPinia())

app.use(router)

app.mount('#app')

document.addEventListener('click', (e) => {
  console.log(e.currentTarget, e.target)
  console.log('click')
})
