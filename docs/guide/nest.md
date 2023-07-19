# 共有依赖和嵌套使用

## 共有依赖
使用cdn，子应用中加上`merak-ignore`即可
即
```html
<script src='xx' merak-ignore></script>
```

::: warning 提醒
需要注意的是，共有依赖，也就是cdn中的功能，都**无法**进行隔离，

共享依赖，意味着多个应用都会调用，具备隔离性就没意义了。所有微前端方案均是如此

不过需要注意的是，共享依赖必须要是和全局无关的，如果依赖了`document`之类,会很危险
:::

## 子应用嵌套
子应用嵌套时，`merak-core`的依赖务必使用共有依赖,主子应用的`merak-core`必须用的是同一个。[详见](https://github.com/fgsreally/merak/tree/main/examples/main-nest/vite.config.ts)
其次，不同应用必须要分配不同的`id`，不能重名