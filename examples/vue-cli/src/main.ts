
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// import { $onExec } from 'merak-helper'
//@ts-expect-error webpack conf
__webpack_public_path__ = window.__merak_url__?window.__merak_url__+'/' : '/'

createApp(App).use(router).use(ElementPlus).mount('#app')

