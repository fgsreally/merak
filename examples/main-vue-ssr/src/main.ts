import { createSSRApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'

export function createApp() {
  const app = createSSRApp(App)
  app.use(router)
  return { app, router }
}
