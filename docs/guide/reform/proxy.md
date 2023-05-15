# 沙箱
默认隔离的变量有`document`,`window`,`self`,`history`,`location`
其他需要隔离的变量，必须标明在子应用的插件中，

## 默认规则
详见[源码]()

## 自定义规则
可以对规则进行更改
本质就是自己写一个[createProxy](),然后在创建对象时往里面传

```ts
const customProxy = {
  document: {
    get(target, p) {
      if (p === 'test')
        return 'test'
      // ..
    }
  }
}
const app = new Merak(name, url, { proxy: customProxy })
```
子应用中
```ts
if (window.$Merak)
  document.test// 'test'
```

