# 比较

相比于其他框架，我认为这些方面是需要被关注的

- **`esm`支持**  

`merak`对不同的打包器/视图框架/模块加载方案一视同仁，可以在任何环境中，获得完全一致的体验


- **高性能**  

1. 从`js`执行层面：   
`merak`只会在`proxy`这一层损失性能，而其他框架会在`proxy`外至少经过一层额外的性能损耗，

2. 从资源请求层面：  
等同于原生的请求，而其他框架则存在`custom fetch`去对`fetch`进行重写

3. 从`dom`层面：  
没有对`dom`的追踪，如`garfish`等中，均是对`createElement`做劫持，从而追踪`dom`，`无界`稍有不同,但也追踪了`style`中的相应样式规则

4. 从样式层面：  
没有做任何事情，没有样式追踪，没有样式改造

> 我没有办法举个具体的例子来做对比，因为不同业务场景中负担不同，模拟创建1000个组件然后挂载，这并不符合真实情况，我只能说，性能的损耗，将不会来自于`merak`本身

> 因为`框架`这个层面不再创造性能消耗，性能问题将完全回归应用本身，微前端不再是用性能换维护的模式，也不再是B端的专属话题，可以在更多的领域尝试它

- **更低的bug可能**  

微前端中很多问题的来源并不是框架本身，而是某个用到的库内部存在奇思妙想，用了一些可能不是那么正规的写法，然后框架本身可能基于性能或其他，做了一些干涉（比如劫持`script`请求与拔插），导致执行环境与单独运行有一定不同，致使这种不正规情况爆发隐患。

`merak`本身尽量减少对浏览器原生行为的干涉，减少冲突的可能，即使出现问题，也会降低排查难度

- **可拆分的功能**  

其余框架追求内部状态封闭，从而暴露简洁的`api`,很多时候使用者都会从中受益，但一旦遇到特殊的情况，或许是微前端框架本身的`bug`，也或许是特殊的需求，使用者就有点骑虎难下，明明觉得很多功能很合适，但却因为一个小问题不得不放弃使用。

`merak`分为三部分，一部分是编译时，一部分是沙箱，还有一部分是控制应用加载和挂载的`Merak`实例+`webcomponent`，

开发者可以自由拆卸组装这些功能，制作独属于自己的微前端框架

<!-- > 比如现在的`ssr`组件，还处于实验状态，你可以保留编译时和沙箱，增加一个自己的`ssr web component`,创建一个`Merak`的子类，修改方法，从而实现自定义的`ssr`效果 -->
> 比如部分沙箱功能不符合预期，比如你可能不喜欢这种无界的基于`query`的路由分配，而更喜欢`qiankun`的路由分配，只需要去更改沙箱的`location`,`history`即可，又比如，你希望子应用的`load`之类的事件正确触发，那可以自定义沙箱中的`window`规则

5. **SSR**  
目前来讲，应该没有能支持`ssr`的微前端方案，
服务端侧的改造可以看`example`,这个没有强制的规定，流式也是支持的

> `single-spa`、`cloudflare`团队在这方面均有相关尝试，但大多不现实

