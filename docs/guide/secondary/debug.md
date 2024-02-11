# debug/error
 
## 运行时调试
开启调试模式
```js
window.MERAK_DEBUG = true
```
可在控制台`verbose`看到调试信息，主要是沙箱的运行情况

## 编译时调试
在vite/webpack/cli中设置`logPath`,它会产生一个含有调试信息的`md`文件，包括隔离了哪些变量、有哪些可能会有问题（eval）

:::info 变量不被隔离
如果希望某个函数使用的`document`不被隔离，但没法引入`merak-helper`
那么可以在变量前添加:
```js
/** @merak */document
```
> 必须要一模一样,不能有多余空格
这主要对于`npm`包，建议与`patch-package`共用


隔离是隔离变量上的所有属性和方法，但有的时候硬需要变量本身，比如`observe(document)`，没法隔离，只能这样解决。
:::

## 错误处理
错误处理有两种：公共的和专属的
### 公共
当没有示例专属的错误处理时，就会直接调用类上的静态函数，即公共的错误处理
```ts
Merak.errorHandler = (opts: { type: string; error: Error; instance?: Merak }) => {

}
```

### 专属
如果某个子应用需要特殊的错误监控
```ts
getInstance(id).errorHandler = (opt: { type: string; error: Error }) => {

}
```
> 默认会输出错误信息，但不会抛出错误！
> 错误处理主要是服务监控系统


