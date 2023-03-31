# 库模式

如果执意使用模块联邦等方案（引入的是`js`文件而非`html`），天璇 提供了库模式，当挂载一个组件时（如果对象不是一个需要挂载的组件，意义较小），会给它提供一个单独的上下文进行,对其进行隔离

> 包括`dom`和样式的隔离

### 原生

```js
const app = new Merak(name, url, { proxy: createLibProxy(name, url) })
```

```html
<merak-block data-merak-id="id" data-merak-varname="分配的变量名"></merak-block>
```


::: warning 提醒

1. 这是个实验性质的功能
2. 优点\缺点和普通模式一样
3. 没有对`location`,`history`的隔离

:::
