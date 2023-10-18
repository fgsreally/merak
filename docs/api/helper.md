# helper

`merak-helper`在子应用中使用,其本身没有依赖，代码极少，无论应用作为子应用/独立运行，均有效
> 即使该应用并没有进入微前端体系，也可以放心使用它，当后续需要放入微前端时，这会省下很多力气  
> 即使是封装库时，也可以放心使用，因为它过于简单以致于很难造成什么不好的影响  
> 会方便一点，但你也可以不用它
:::tip 考量
`helper`有两方面的考虑，
1. 提供了工具，加速开发，
2. 为了解决歧义性问题，比如此时使用`$document`必然获得真正的`document`，
:::

```ts
type MerakEvent = 'mount' | 'destroy' | 'hidden' | 'unmount' | 'relunch'
// 是否作为子应用
declare const isMerak: boolean
// 获得真正的window（不被隔离的）
declare function $window(): Window
// 获得真正的document
declare function $document(): Document

// 获得真正的body/head/location/history
declare function $body(): HTMLElement
declare function $head(): HTMLHeadElement
declare function $history(): History
declare function $location(): Location
// 所有钩子都返回的是接触监听的函数
// 子应用挂载钩子
declare function $onMount(cb: () => any): () => false | void

// 获得merak实例
declare function getInstance(id: string): any
// 获得子应用自己的实例
declare function $instance(): Merak<merak_core_dist_index_fd6b42e9.a>
// 获得子应用实例的props
declare function $props(): Props
declare function $props<K extends keyof Props>(key: string): Props[K]
// 获得子应用实例的namespace
declare function $namespace(): NameSpace
declare function $namespace<K extends keyof NameSpace>(key: string): NameSpace[K]
// 获得子应用实例的性能控制器
declare function $perf(): merak_core.Perf
/**
 * @experiment 阻止冒泡
 */
declare function $stopBubble(isPass?: boolean): void

// 子应用卸载钩子
declare function $onUnmout(cb: () => any): () => false | void
/**
 * 以下两个在$onUnmout回调中调用
 */
// 手动销毁应用，通过innerHtml转成字符串进行缓存
declare function $deactive(): void
// 不要使用，这会彻底销毁应用
declare function $destroy(): void
// 包裹需执行的script脚本，比如eval，返回字符串
declare function $sandbox(script: string): string
// 包裹需执行的esm脚本，返回字符串
declare function $esm(script: string): string
```
子应用的多数以`$`开头，而主应用中对应的方法则以`$$`开头