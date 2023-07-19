# vue
## 共有配置

```ts
interface ShareProps {

  name: { // 即实例id，必填
    type: String
  }
  url: { // 对应地址，必填
    type: String
  }
  props: { // 传给子应用的数据
    type: PropType<any>

  }
  proxy: { // 使用的沙箱
    type: PropType<ProxyGlobals>
  }
  keepAlive: { // keep-alive
    type: Boolean
    default: false
  }
  iframe: { // iframeId
    type: String
  }
}
```

## MerakApp 的配置
和`core`中配置一致
```ts
interface MerakAppProps extends ShareProps {
  configOrUrl: {
    type: PropType<string | MerakConfig>// Merak实例的第三个参数
  }

  loader: {
    type: PropType<Loader>// loader，默认采用一个内置的pureloader
  }
  route: {
    type: String// 跳转页面
  }

}
```

## MerakSRR
没有其他配置

## MerakBlock
```ts
interface MerakBlockType {
  // 全局变量名
  name: {
    type: String
    required: true
  }
}
```
