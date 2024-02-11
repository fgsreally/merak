# 共有依赖和嵌套使用

## 共有依赖
比如主子应用都用了一个`vue`的`cdn`,

子应用中加上`merak-ignore`即可
即
```html
<script src='xx' merak-ignore></script>
```
这样作为子应用加载时，这个`script`会被忽略

::: warning 提醒
需要注意的是，共有依赖，也就是cdn中的功能，都**无法**进行隔离，

共享依赖，意味着多个应用都会调用，具备隔离性就没意义了。所有微前端方案均是如此

所以共享依赖必须要是和全局无关的，如果依赖了`document`之类,会很危险
:::

## 应用嵌套
嵌套使用时，`merak-core`的依赖务必使用共有依赖,所有应用的`merak-core`必须用的是同一个。[详见](https://github.com/fgsreally/merak/tree/main/examples/main-nest/vite.config.ts)

其次，不同应用必须要分配不同的`name`，不能重名