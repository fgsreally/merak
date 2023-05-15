# 默认配置


## 数据/功能共享

```ts
// 主营用中
const app = new Merak(/** */)
app.props.test = () => console.log('test')
```

```ts
if (window.$Merak)
  window.$Merak.props.test()// output:test
```
## 事件总线

`merak`不提供事件总线，但实现它很容易。本质上就是有一个东西可以所有应用共享，可以这样

```ts
Merak.namespace.emitter = emitter// your event emitter
```
> Merak的静态属性，可以在多个应用中共享，[详见]()

也可以这样
```ts
class YourMerak extends Merak {
  public emitter = emitter// your event emitter
  constuctor(/** */) {
    super(/** */)

  }

  on() {
    // ..
  }

  emit() {
    // ..
  }

}
```

## 路由

简而言之，至少在默认配置下，`merak`的很多表现和无界几乎一致，路由也沿袭着`query`的模式,


## 子应用事件
这等同于`qiankun`的生命周期改造，即`bootstrap、mount、unmount`
每次挂载，都会触发`merak_mount`，如果打开`keep-alive`,那么卸载时触发`merak-hidden`，否则是`merak_destroy`
当被`destory`了以后再挂载，就会触发`merak_relunch`
如果需要第一次执行，也就是`bootstrap`的效果，直接执行即可
```ts
render()// 第一次才会执行
if (window.$Merak) {
  window.addEventListener('merak_relunch', () => {
    render()
  })

  window.addEventListener('merak_destroy', () => {
    app.unmount()
  })
}
```

> 子应用中，以`merak_`开头的事件,默认会加上这个项目的`id`,比如`merak_relunch`在项目`vite_vue`中就会变成`merak_relunchvite_vue`,保证该事件仅对应特定子应用,且这类事件不会被注销

> 建议直接使用[merak-helper]('./api/helper.md')