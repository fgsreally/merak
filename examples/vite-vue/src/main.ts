import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import type { App as AppType } from 'vue'
import { $onMount, $onUnmount, $props, $stopProp } from 'merak-helper'
import App from './App.vue'
import router from './router'
import './assets/main.css'

let app: AppType

function render() {
  app = createApp(App)

  app.use(createPinia()).use(ElementPlus)
  app.use(router)
  app.mount(document.querySelector('#app'))
}
$onMount(render)
$stopProp(true)
$onUnmount(() => {
  app.unmount()
})

console.log($props('name'))
