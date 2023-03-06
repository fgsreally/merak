# ssr
当主子应用均为`ssr`时，子应用的`ssr`效果能在主应用中起效

## 服务端
服务端需要做一定改造，往`html`中加入一段`template`
具体规则如下
```html
<html>
...
<template id="data-merak-id" merak-config='{"fakeGlobalName":"name"}'>
    <!-- 子应用的ssr渲染结果 -->
</template>
</html>
```
>  一个纯粹的脑洞：可以启动多个线程，每个线程渲染一个子应用，然后填充到主应用再返回

## 客户端
```html
<merak-ssr keep-alive id="data-merak-id"></merak-ssr>
```
往挂载的地方添加就行