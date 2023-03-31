---
sidebarDepth: 2
collapsable: false
---

# 快速上手


## 设置子应用
### 应用
以`vue`为例，
```ts
function render() {
  app = createApp(App)
  app.mount('#app')
}

render()

if (window.$Merak) {
  window.addEventListener('merak_relunch', () => {
    render()
  })

  window.addEventListener('merak_destroy', () => {
    app.unmount()
  })
}
```
### 打包器
需要根据打包器，安装vite-plugin-merak/webpack-plugin-merak
以`vite`为例
```ts
import { Merak, merakPostCss } from 'vite-plugin-merak'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Merak(fakeGlobalVar/** 子应用专属的变量名 */, []/** 额外需要被替换的全局变量 */,)],
  css: {
    postcss: {
      plugins: [merakPostCss()],
    },
  },
})
```
> `fakeGlobalVar`必须是一个合法的,未被占用的变量名




### 设置主应用
> js中创建`Merak`实例，必须先于html挂载，都是如此


```ts
import { MERAK_DATA_ID, Merak, createApp, createWorkerApp, getUrl, injectStyle } from 'merak-core'
import { PureLoader } from 'merak-core/loader'
/** 设置加载器 */
const loader = new PureLoader()
/** 设置子应用配置 */
const app = new Merak(name/** 子应用name */, url/** 子应用url */, { loader })

createApp(app, loader)

/** 可以提前加载它，也可以挂载时自动加载 */
await app.load()
/** 可以提前渲染 */
await app.prerender()
```
::: tip 提示
挂载位置通过web-component确定,不限制框架，此处以vue为例
:::

```vue
<merak-app :data-merak-id="name"></merak-app>
```

