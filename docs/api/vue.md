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
