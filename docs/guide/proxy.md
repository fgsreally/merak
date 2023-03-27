# 沙箱隔离
默认隔离的变量包括`document`,`window`,`self`,`history`,`location`
其他需要隔离的变量，必须标明在子应用的插件中

## 默认规则
详见[源码]()

## 自定义规则
可以对规则进行更改,详见[例子](),
本质就是自己写一个[createProxy](),然后在创建对象时往里面传

```ts
const app = new Merak(name, url, { proxy: customProxy })
```

