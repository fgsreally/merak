---
sidebarDepth: 2
collapsable: false
---

# 快速上手


## 子应用

### 安装
```shell
npm i merak-helper
```
需要根据打包器，安装`vite-plugin-merak`/`webpack-plugin-merak `  
```shell
npm i vite-plugin-merak -save-dev
```

### 代码  

以`vue`为例，
```ts
// in main.ts
import { $onMount, $onUnmount } from 'merak-helper'
let app: AppType
function render() {
  app = createApp(App)
  app.mount('#app')
}
$onMount(render)// 挂载时执行
$onUnmount(() => app.unmount())// 卸载时执行
```  
就是暴露生命周期，没有什么特殊的

### 配置

以`vite`为例
```ts
import { Merak } from 'vite-plugin-merak'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Merak('sub1'/** 子应用专属的变量名 */,)],
})
```
> `fakeGlobalVar`必须是一个合法的,未被占用的变量名,和`umd`中`library name`性质差不多

> `webpack`见[example](https://github.com/fgsreally/merak/blob/main/examples/vue-cli/vue.config.js)


## 主应用
以`vue`为例，

```vue
<script setup >
import { MerakApp } from 'merak-vue'
</script>

<template>
  <MerakApp
    name="sub1" url="http://localhost:4005"
  />
</template>
```

