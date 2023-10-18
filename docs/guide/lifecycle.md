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


