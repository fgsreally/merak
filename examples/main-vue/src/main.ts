import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { Merak, vueLoader } from 'merak-vue'
new Merak('vite_vue', 'http://127.0.0.1:4004/', { loader: vueLoader }).preRender()
const app = createApp(App)
app.use(createPinia())
app.use(router)

app.mount('#app')
