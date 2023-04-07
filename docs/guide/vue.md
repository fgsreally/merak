# merak-vue
提供简单封装的vue组件
> 在`vue`封装中，默认分配的变量名就是项目的`id`

## spa 模式
```vue
<script setup lang="ts">
import { MerakApp } from 'merak-vue'
</script>

<template>
  <MerakApp name="分配的变量名" url="子应用url" />
  <!-- name is equal to data-merak-id -->
</template>
```
## ssr

```vue
    <MerakSSR name="分配的变量名" url="子应用url"  />
```

## 库模式
```vue
  <MerakBlock name="分配的变量名" url="远程组件url" />
```

具体可见[example]()
参数可见[类型定义]('../api/helper.md')