# 沙箱隔离
默认隔离的变量包括`document`,`window`,`self`,`history`,`location`
其他需要隔离的变量，必须标明在子应用的插件中

## 默认规则
详见[源码]

## 自定义规则
可以对规则进行更改(下例是将子应用中`localStorage`操作转为内存操作)
```ts
const app = new Merak(name, url, {
  customHandler: (param) => {
    param.localStorage = {
      get(target, key) {
        if (key === 'setItem')
          return (k, v) => target[k] = v
        if (key === 'getItem')
          return k => target[k]
      },
    }// 本质就是一个proxy handler
    return param
  }
})
```
可以重写默认的规则
```ts
const app = new Merak(name, url, {
  customHandler: (param) => {
    param.document.get = () => {
      // ...
    }
    return param
  }
})
```