import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import type { App as AppType } from 'vue'
import { $deactive, $onMount, $onUnmount, $stopBubble } from 'merak-helper'
import App from './App.vue'
import router from './router'
import './assets/main.css'
let app: AppType

function render() {
  app = createApp(App)
  app.use(createPinia()).use(ElementPlus)
  app.use(router)
  new Function('add')
  eval('33')
  // const scriptEl = document.createElement('script')
  // scriptEl.innerHTML = $sandbox('console.log(location.href)')

  // const div = document.createElement('div')

  // div.innerHTML = `
  // <button onmousedown="${$sandbox('console.log(location)')}">click</button>
  // `
  // document.body.appendChild(scriptEl)

  // document.body.appendChild(div)

  app.mount(document.querySelector('#app'))
}
$onMount(render)
$stopBubble(true)

$onUnmount((flag) => {
  app.unmount()
  if (flag === 'destroy')
    $deactive()
})
