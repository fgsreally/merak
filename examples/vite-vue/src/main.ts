import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

import './assets/main.css'
const app = createApp(App)

app.use(createPinia()).use(ElementPlus)
app.use(router)

app.mount('#app')

window.addEventListener('click', () => {
  console.log(1)
})

console.log('mount vue')
