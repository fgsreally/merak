# iframe模式
```ts
const app = new Merak(name/** 子应用name */, url/** 子应用url */, { iframe: true })
```
这会使所有`js`在`iframe`中执行，销毁时移除`iframe`从而保证资源完全释放

> 如果钩子中已经安排了释放资源的步骤，那这个模式就没什么用（请这样做）
> 如果子应用始终出现不明原因的内存泄漏，可以尝试一下这个