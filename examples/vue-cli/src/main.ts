/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import {$onMount,$onUnmount, $deactive} from 'merak-helper'
// import { $onExec } from 'merak-helper'
//@ts-expect-error webpack conf
__webpack_public_path__ = window.__merak_url__?window.__merak_url__+'/' : '/'

let app:any

function render(){
app=createApp(App).use(router).use(ElementPlus)
app.mount(document.querySelector('#app')!)
}

$onMount((status)=>{
    console.log('status',status)
    render()
    setInterval(()=>{
        console.log('x')
    },3000)
})

$onUnmount((flag)=>{
    app.unmount()
    if(flag==='destroy'){
        $deactive()

    }
})