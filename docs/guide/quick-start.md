---
sidebarDepth: 2
collapsable: false
---

# 快速上手


## 设置子应用
### 应用  

以`vue`为例，
```ts
// in main.ts
import { $onExec } from 'merak-helper'
let app: AppType
function render() {
  app = createApp(App)
  app.mount('#app')
}
$onExec(render)// 挂载时执行
$onDestroy(() => app.unmount())// 卸载时执行
```  

### 打包器
需要根据打包器，安装`vite-plugin-merak`/`webpack-plugin-merak `  

以`vite`为例
```ts
import { Merak } from 'vite-plugin-merak'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Merak(fakeGlobalVar/** 子应用专属的变量名 */, []/** 额外需要被替换的全局变量 */,)],
})
```
> `fakeGlobalVar`必须是一个合法的,未被占用的变量名,和`umd`中`library name`性质差不多

> `webpack`见[example]()


## 设置主应用
> 创建`Merak`实例，必须先于html挂载

以原生为例,在`js`中
```ts
import { Merak } from 'merak-core'
import { PureLoader } from 'merak-core/loader'
/** 设置加载器 */
const loader = new PureLoader()
/** 设置子应用配置 */
const app = new Merak(name/** 子应用name */, url/** 子应用url */, { loader })
```
在`html`中
```html
<merak-app :data-merak-id="name"></merak-app>
```



