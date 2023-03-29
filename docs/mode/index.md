# 模式

默认定义了`merak-app`,`merak-block`,`merak-ssr`三个`webcomponent`，分别对应了`spa`，`库模式`,`ssr`,每一个模式又存在`keep-alive`和`iframe`模式

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