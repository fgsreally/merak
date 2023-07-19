# helper

`merak-helper`在子应用中使用,其本身没有依赖，代码极少，无论应用作为子应用/独立运行，均有效
> 即使该应用并没有进入微前端体系，也可以放心使用它，当后续需要放入微前端时，这会省下很多力气  
> 即使是封装库时，也可以放心使用，因为它过于简单以致于很难造成什么不好的影响  
> 会方便一点，但你也可以不用它
:::tip 考量
`helper`有两方面的考虑，一是提供了工具，加速开发，二是为了解决歧义性问题，比如此时使用`$document`必然获得真正的`document`，
:::
```ts
type MerakEvent = 'mount' | 'destroy' | 'hidden' | 'unmount' | 'relunch'
// 获得真正的window
declare function $window(): Window
// 获得真正的document
declare function $document(): Document
// 是否作为子应用
declare function isMerak(): boolean
// 获得真正的body/head
declare function $body(): HTMLElement
declare function $head(): HTMLHeadElement
// 所有钩子都返回的是接触监听的函数
// 子应用挂载钩子
declare function $onMount(cb: () => any): () => false | void
// 子应用重启钩子
declare function $onRelunch(cb: () => any): () => false | void
// 子应用隐藏钩子
declare function $onHidden(cb: () => any): () => false | void
// 子应用销毁钩子
declare function $onDestroy(cb: () => any): () => false | void
// 子应用运行钩子，独立运行时，直接执行callback,作为子应用运行时，执行callback，并用relunch钩子绑定callback
declare function $onExec(cb: () => any): any
// 包裹需执行的script脚本，比如eval，返回字符串
declare function $sandbox(script: string): string
// 包裹需执行的esm脚本，返回字符串
declare function $esm(script: string): string
```