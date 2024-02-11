# 基础功能

## 基础使用


## 数据/功能共享

```ts
// 主应用中
const app = new Merak(/** */)
app.props.test = () => console.log('test')
```

```ts
// 子应用中
import { $props, isMerak } from 'merak-helper'
if (isMerak)
  $props().test()// output:test
```
## 事件总线

`merak`不提供事件总线，但实现它很容易。本质上就是有一个东西可以所有应用共享，可以通过静态属性实现

```ts
Merak.namespace.emitter = emitter// your event emitter
```
也可以通过上文功能共享实现


## 路由

简而言之，至少在默认配置下，`merak`的很多表现和无界几乎一致，路由也沿袭着`query`的模式,

:::info 路由跳转
跳转到指定应用的指定路由

这根视图框架中的路由原理有关，不一定起效
```ts
import { $$jump } from 'merak-core'
import { $jump } from 'merak-helper'
// 主应用中
$$jump(id, route)
// 子应用中
$jump(id, route)
```
:::
> 这并非一定，可以通过沙箱进行修改