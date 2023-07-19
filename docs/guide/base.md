# 默认配置


## 数据/功能共享

```ts
// 主应用中
const app = new Merak(/** */)
app.props.test = () => console.log('test')
```

```ts
// 子应用中

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

如果需要路由跳转，详见[merak-helper](../api/helper.md)
