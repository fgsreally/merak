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
如果不使用打包器，可使用[脚手架](../api/cli.md)

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
> 如果无法暴露生命周期，详见[iframe模式](./mode.md#iframe模式)


## 主应用

> 创建`Merak`实例，必须先于`html`挂载
和无界差不多，使用了`web component`


在`js`中
```ts
import { CompileLoader, Merak } from 'merak-core'
/** 设置加载器 */
const loader = new CompileLoader()
/** 设置子应用配置 */
const app = new Merak(name/** 子应用name */, url/** 子应用url */, { loader })
```

在`html`中
```html
<merak-app :data-merak-id="name"></merak-app>
```


`vue`[详见](./vue.md)

`react`[详见](./react.md)
