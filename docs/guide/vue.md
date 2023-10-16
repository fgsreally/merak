# merak-vue
提供简单封装的vue组件


```vue
<script setup lang="ts">
import { MerakApp, MerakBlock, MerakSSR } from 'merak-vue'
</script>

<template>
  <!-- spa -->
  <MerakApp name="id" url="子应用url" />
  <!-- ssr -->
  <MerakSSR name="id" url="子应用url" />
  <!-- lib -->
  <MerakBlock name="id" url="远程组件url" />
  <!-- name is equal to data-merak-id -->
</template>
```


具体可见[example](https://github.com/fgsreally/merak/tree/main/examples/main-vue)
参数可见[类型定义](../api/vue.md)