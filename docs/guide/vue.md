# merak-vue
提供简单封装的vue组件


```vue
<script setup lang="ts">
import { MerakApp, MerakImport, MerakSSR, MerakScope } from 'merak-vue'
const Lib = defineAsyncComponent(() => import(path))
</script>

<template>
  <!-- spa -->
  <MerakApp name="id" url="子应用url" />
  <!-- ssr -->
  <MerakSSR name="id" url="子应用url" />
  <!-- lib -->
  <MerakImport name="id" fake-global-var="vue_lib" source="http://localhost:5000/lib.js" />
  <MerakScope name="id" fake-global-var="vue_lib">
    <Lib v-bind="{ type: 'lib' }" />
  </MerakScope>

  <!-- name is equal to data-merak-id -->
</template>
```
> `MerakImport`/`MerakScope`是库模式，也就是`js`为入口（远程必须是一个组件！），只不过前者需要输入源`url`,而后者是在插槽中的异步组件

案例可见[example](https://github.com/fgsreally/merak/tree/main/examples/main-lib-vue)

参数可见[类型定义](../api/vue.md)