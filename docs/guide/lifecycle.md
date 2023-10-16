# lifeCycle
## 主应用中的生命周期

具体生命周期详见[LifeCycle](../api/lifecycle.md)

案例如下
```ts
// example
const app = new Merak(/** */)
app.lifeCycle.beforeMount = () => {}
```

## 子应用的生命周期

子应用的操作详见[merak-helper](../api/helper.md)

```ts
import {
  $onMount,
  $onUnmount
} from 'merak-helper'

$onUnmount(() => {
  // 卸载时or beforeunload
})

$onMount(() => {
  // 挂载时or启动时
})
```

有无keep-alive的区别是没有区别（非iframe中）

在内部版本里，没有keep-alive会通过`innerHtml`的方式进行状态保留，但这会有一些问题，故而移除，如果确实需要该功能，那么可以：
```ts
import {
  $done,
  $onDestroy,
} from 'merak-helper'
$onDestory(() => {
  // ..
  $done()
})
```
换言之，如果需要根本上移除子应用，应由子应用调用

> 姑且可以理解为一个生产-消耗模型：子应用提供选择，主应用负责调用
> 我不确定这是不是个好的选择，如果你不认同，可以改写merak的类,详见[沙箱改造](./reform/proxy.md)