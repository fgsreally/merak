# ssr
> 实验性功能
当主子应用均为`ssr`时，子应用的`ssr`效果能在主应用中起效

## 服务端

服务端需要做一定改造，需往`html`中加入一段`template`：

```html
<html>
  ...
  <template id="项目id" merak-config='{"fakeGlobalVar":"name"}'>
    <!-- 子应用的ssr渲染结果 -->
  </template>
</html>
```
> `template` 只是模板，里面的东西既不会渲染也不会执行

## 客户端


```ts
const app = new Merak(id, url)
```

```html
<merak-ssr data-merak-id="项目id"></merak-ssr>
```
