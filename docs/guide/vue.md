# merak-vue
提供简单封装的vue组件

## spa 模式
```vue
<script setup lang="ts">
import { MerakApp } from 'merak-vue'
</script>

<template>
  <MerakApp name="id" url="子应用url" />
  <!-- name is equal to data-merak-id -->
</template>
```
## ssr

```vue
    <MerakSSR name="id" url="子应用url"  />
```

## 库模式
```vue
  <MerakBlock name="id" url="远程组件url" />
```

具体可见[example](https://github.com/fgsreally/merak/tree/main/examples/main-vue)
参数可见[类型定义](../api/vue.md)