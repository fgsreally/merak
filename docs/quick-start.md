---
sidebarDepth: 2
collapsable: false
---

# 快速上手

## 主应用


## 设置子应用
只需要根据打包器，安装vite-plugin-merak/webpack-plugin-merak
```ts
// vite
import Merak from 'vite-plugin-merak'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Merak(fakeGlobalName/** 子应用专属的变量名 */, []/** 额外需要被替换的全局变量 */,)],

})
```
> fakeglobalname必须是一个合法的,未被占用的变量名

```ts
const { defineConfig } = require('@vue/cli-service')
const { Merak } = require('webpack-plugin-merak')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    devServer: {
      headers: { // 开发时需要跨域
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*'
      }
    },

    plugins: [
      new Merak(fakeGlobalName, []),
    ]
  }
})
```

merak不会固执地追求100%的隔离，而是通过更改全局变量的指向，自由地给子应用添加约束。在子应用中通过插件的第二个参数，声明这些需要被更改的全局变量名

> 比如，开发者希望子应用中的时间比主应用中快个10s（一个过于极端的情况），希望使`Date.now`读到的值偏大，那么可以在这里加上`Date`，然后在主应用中设置相应的规则。
<!-- > 好吧，我也觉得说得不是很明白，那么举个极端点的例子，如果主应用中存在两个子应用A和B，我希望A在某时不能使用Proxy，B在某时不能使用(当然这只是假设，如果想要) -->


::: tip 隔离
- 默认会隔离`window`,`document`,`location`,`history`,`self`这几个变量
:::


### 设置主应用

#### 原生
```ts
import { MERAK_DATA_ID, Merak, createApp, createWorkerApp, getUrl, injectStyle } from 'merak-core'
import { PureLoader, mainPlugin } from 'merak-core/loader'

/** 设置子应用配置 */
const app = new Merak(name/** 子应用name */, url/** 子应用url */)

/** 设置并绑定加载器与应用实例 */
const loader = new PureLoader([mainPlugin(app)])
createApp(app, loader)

/** 可以提前加载它，也可以挂载时自动加载 */
await app.load()
/** 可以提前 */
await app.prerender()
```
::: tip 提示
挂载位置通过web-component确定,不限制框架，此处以vue为例
:::

```vue
<merak-app :data-merak-id="name"></merak-app>
```

