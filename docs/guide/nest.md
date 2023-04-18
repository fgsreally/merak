## 共有依赖和嵌套使用
共有依赖，建议使用esm的cdn，我没有测试过umd ，但我认为没有什么问题

::: warning 提醒
需要注意的是，cdn中的功能，无论涉及dom/window/history，都无法进行隔离。
> 并非完全没有可能，我个人是使用`systemjs`解决，但常规的`esm`之流，应该是搞不定的
> 换言之，这就是没有`custom fetch`的代价。如果想要共有依赖具备隔离，必须要有能`custom fetch`的加载方案
:::

## 子应用嵌套
有一点需要注意，子应用嵌套时，`merak`的依赖务必使用共有依赖,主子应用的`merak`必须用的是同一个。[详见](/examples/main-vue/)
还有，不同应用必须要有不同的名字，不能重名