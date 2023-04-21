import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { beforeMount } from 'merak-vue'

beforeMount(({ instance }) => console.log(instance))
const app = createApp(App)
app.use(createPinia())
app.use(router)

app.mount('#app')
