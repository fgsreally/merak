

# 特殊模式
## iframe模式
```ts
import { Merak } from 'merak-core'

const app = new Merak(name/** 子应用name */, url/** 子应用url */, { iframe: 'iframeid' })
```

这会使子应用`js`在`iframe`中执行，
注意 ，同一个`iframeid`的子应用会被分配到同一个`iframe`中执行`js`，当一个`iframeid`中所有子应用都被销毁时，才移除该`iframe`

::: tip 提醒
1. 子应用可以不暴露钩子，原因详见[详见](../blog/question-from.md#难以面面俱到的隔离)，但必须保证该子应用的`iframeid`唯一
2. 不暴露钩子时,这和无界的重建模式一致
3. 不优先考虑，但如果子应用始终出现不明原因的错误，可以尝试一下
4. 如果你需要同时打开子应用的两个路由页面，只需创建两个实例，保证`iframeid`不相同就好
::: 


## 库模式

> 如果执意使用模块联邦等方案（引入的是`js`文件而非`html`）

当挂载一个组件时（如果对象只是一段普通脚本而非一个需要挂载的组件，意义较小，因为这样没有必要`dom`隔离），会给它提供一个单独的上下文进行,对其进行隔离

> 包括`dom`/`style`/`js`的隔离



```js
import { Merak, createLibProxy } from 'merak-core'
const app = new Merak(name, url, { proxy: createLibProxy(name, url) })
```



::: warning 提醒

1. 优点\缺点和普通模式一样
2. 没有对`location`,`history`的隔离
:::


## ssr

当主子应用均为`ssr`时，子应用的`ssr`效果能在主应用中起效
> 这倒也不一定，可以是一个网关之类的东西，反正能把子应用的`html`拼到主应用上，再返回给浏览器就行

### 服务端

服务端需要做一定改造，需往主应用`html`中加入一段：

```html
<html>
  ...
  <template data-merak-url="url">
    <!-- 子应用的ssr渲染结果(html) -->
  </template>
</html>
```


:::tip 注意

请注意：这不是真正的`ssr`,它并不能“跑”在服务端中，毕竟，操作dom是不可回避的事情。

它只是通过注入一段`template`到`html`中，在客户端渲染时，直接拿到`template`进行渲染。

简而言之，对`seo`和`首屏渲染`均有助益，对`ssr`使用者应该足够有吸引力

> 也可以将`template`换成其他标签，使其不可见就行
:::

### 客户端
原理详见[loader](./loader.md#ssrloader)
> 也可以自己设计`ssr`的流程
```ts
const loader = new SSRLoader()
const app = new Merak(id, url, {
  loader
})
```


