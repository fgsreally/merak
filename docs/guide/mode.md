# 模式

默认定义了`merak-app`,`merak-block`,`merak-ssr`三个`webcomponent`，分别对应了`spa`，`库模式`,`ssr`,每一个模式又存在`keep-alive`和`iframe`模式(彼此并不冲突)

## keep-alive
就是`display:none`


## iframe模式
```ts
const app = new Merak(name/** 子应用name */, url/** 子应用url */, { iframe: 'iframeid' })
```
这会使所有`js`在`iframe`中执行，销毁时移除`iframe`从而保证资源完全释放
注意 ，同一个`iframeid`的子应用会被分配到同一个`iframe`中执行`js`

::: tip 提醒
1. 子应用可以不暴露钩子，原因[详见]()
2. 当不打开`keep-alive`,这和无界的重建模式一致[]()
3. 不优先考虑，但如果子应用始终出现不明原因的错误，可以尝试一下不打开`keep-alive`的同时使用`iframe模式`
4. 如果你需要同时打开子应用的两个路由页面，只需创建两个实例，保证`iframeid`不相同就好
::: 


## 库模式

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


## ssr
> 实验性功能
当主子应用均为`ssr`时，子应用的`ssr`效果能在主应用中起效

## 服务端

服务端需要做一定改造，需往`html`中加入一段`template`：

```html
<html>
  ...
  <template id="项目id" merak-config='{"fakeGlobalVar":"name"}'>
    <!-- 子应用的ssr渲染结果 -->
  </template>
</html>
```
> `template` 只是模板，里面的东西既不会渲染也不会执行

## 客户端


```ts
const app = new Merak(id, url)
```

```html
<merak-ssr data-merak-id="项目id"></merak-ssr>
```
