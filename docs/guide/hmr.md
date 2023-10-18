# 热更新
> 已对`vue/react`框架处理

在开发时，视图框架会注入一些变量用于热更新
注入时有可能会被沙箱隔离掉
> 取决于框架热更新的实现，有可能有问题，也有可能没有

这个时候需要允许这些变量挂载到全局

```ts
if (__DEV__) {
  // work for react
  addWindowVar('$RefreshSig$')
  addWindowVar('$RefreshReg$')
  // work for vue
  addWindowVar('__VUE_HMR_RUNTIME__')
  addWindowVar('__VUE_OPTIONS_API__')
}
```
 如果是其他框架，看框架的热更新变量名，然后同上述方法就好