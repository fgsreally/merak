## 共有配置

```ts
interface ShareProps {
  // instance id
  id: {
    type: String
    required: true
  }
  // url
  url: {
    type: String
    required: true
  }
  // 传入子应用的props
  props: {
    type: any
    // required: true,
  }
  proxy: {
    // 自定义的沙箱，也就是自实现的 createProxy()
    type: any
  }
  keepAlive: {
    // 是否keep-alive
    type: Boolean
    default: true
  }
  iframe: {
    // iframe模式分配的id，默认不开启
    type: String
  }
}
```

## MerakApp 的配置
和`core`中配置一致
```ts
interface MerakAppType {
  configUrl: String
  loader: any
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
