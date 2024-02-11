# 隔离变量

沙箱的原理，是将一些变量隔离，以`document`为例：
```ts
const { document } = fakeGlobalVar
document.createElement('a')
```
这个时候读到的`document`就是沙箱中的`document`了


> 以下部分可在`vite/webpack`插件配置中看到
## 原生隔离变量
`nativeVars`是指像`document`一样，原生就存在的变量

## 自定义隔离变量
`customVars`是指自定义的全局变量，比如`window.a`

:::tip
`nativeVars`和 `customVars`详见`vite`/`webpack`的插件配置


其中`nativeVars`默认为 `['document', 'history', 'location', 'window', 'self', 'globalThis', 'setTimeout', 'setInterval', 'addEventListener'`

`customVars`默认为空


如果你需要一些其他变量被隔离，修改插件配置即可
:::