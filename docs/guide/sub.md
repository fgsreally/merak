

# 子应用中
```ts
if (window.$Merak) { // 证明存在父应用
  window.__merak_url__// 子应用原本所在的 url
  window.$Merak// 子应用对应的实例
  window.rawWindow // 真正的window
}
```
> 建议使用`merak-helper`

子应用中存在`merak-ignore`属性的脚本，在微前端中不会被执行

```html
<script merak-ignore></script>
```