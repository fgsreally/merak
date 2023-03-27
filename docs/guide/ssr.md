# ssr
当主子应用均为`ssr`时，子应用的`ssr`效果能在主应用中起效

## 服务端

服务端需要做一定改造，往`html`中加入一段`template`
具体规则如下

```html
<html>
  ...
  <template id="项目id" merak-config='{"fakeGlobalName":"name"}'>
    <!-- 子应用的ssr渲染结果 -->
  </template>
</html>
```

## 客户端

js 必须先执行

```ts
const app = new Merak(id, url)
```

```html
<merak-ssr data-merak-id="项目id"></merak-ssr>
```
