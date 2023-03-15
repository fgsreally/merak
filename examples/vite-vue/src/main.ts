import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import type { App as AppType } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
let app: AppType
function render() {
  app = createApp(App)

  app.use(createPinia()).use(ElementPlus)
  app.use(router)

  app.mount('#app')
}

render()
// if (window.$Merak) {
//   window.addEventListener('merak_relunch', () => {
//     render()
//   })

//   window.addEventListener('merak_destroy', () => {
//     app.unmount()
//   })
// }
