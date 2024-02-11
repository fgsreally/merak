# vue

## MerakApp 的配置

事件与生命周期等同
```ts
interface MerakAppProps {
  // 即data-merak-id，必填
  name: {
    type: String
  }
  // 对应地址，必填
  url: {
    type: String
  }
  // 传给子应用的数据
  props: {
    type: PropType<any>
  }
  // 使用的沙箱
  proxy: {
    type: PropType<ProxyGlobals>
  }
  // iframeId
  iframe: {
    type: String
  }
  // 快速切换页面时，当卸载->挂载时间小于这个数，不会触发子应用钩子.timeout为0时，则一定会触发
  timeout: {
    type: Number
  }
  loaderOptions: {
    // 传递给loader的值
    type: PropType<any>
  }
  loader: {
    type: PropType<Loader>
  }
  // 初始跳转的路由
  route: {
    type: String
  }
  // 是否缓存样式，默认是
  inlineStyle: {
    type: Boolean
  }
  // 是否使用ssr
  ssr: {
    type: Boolean
    default: false
  }
}
```

## MerakImport/MerakScope

[详见](https://github.com/fgsreally/merak/blob/main/packages/vue/src/block.ts)
