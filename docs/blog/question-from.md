
# 需要解决的问题
其他方案已经暴露了微前端中的关键问题，那么可能需要整理一下：
## 没有那么简单的iframe
`qiankun`指明了iframe的四个问题（这个应该很好找），但这只是对于使用者而言，对设计者来说，iframe微前端方案还有一个真正致命的点--iframe本身。

`iframe`本质是一个黑箱，里面的很多规定是死板的（实际上是未知且死板的，你可能不知道这个规定，但可能知道了也没什么办法，比如iframe中的document在加载中和加载完成时，并不是同一个），

你很难使用某种高明的技法去解决一些问题，严格来讲，是根本做不到。

所以在基于iframe的微前端设计中，不算无界，基本都是不去触碰iframe本身，专注于数据传递和url一致（其实也很难搞）。



## 难以面面俱到的隔离
直白地讲，qiankun不是一个kpi性质的东西，就我个人感觉而言，反而是一个万般无奈下的产物。它并不像是在解决什么，而是在防止什么。

> qiankun对各个子应用抱有一种莫名的敌意

由于qiankun将更多的精力放在兼容而不是体验上，与其是说qiankun是一个体验更好的iframe，不如说iframe是一个隔离得更好的qiankun，毕竟他们体验都不咋样

具体技术细节不赘述。如果只是抱着拆小应用的想法，我不建议all in qiankun

但实际上，qiankun在市场上名声最大，这其实让我关注到了一个点--似乎“隔离”这个东西，需求不大，至少没有我想的这么大

我们理想中的隔离，并不是单指`window`沙箱，而是指当

1. 主子应用互不影响。
2. 卸载时，子应用影响完全消失

:::tip
很多时候，关注点都在子应用不影响主应用，但bug大多来自相反的方向。各种框架力求子应用独立运行时的环境，和作为子应用运行时的环境一致，这其实困难重重，

举个例子，浏览器中是无法让一个`js`文件多次运行的（除了`iframe`），在微前端，只能利用暴露的钩子去加载or卸载，而我们往往在钩子里只让`vue`实例挂载/卸载，但这是不够的，比如内部有个库可能存储了`dom`的状态，卸载时却没有释放，第二次加载时页面上是新的`dom`,而库还在控制上次的缓存。

在开发中我们往往很难意识到某个库做了这样的行为

> 除此还有性能上的考虑，为了优化还要做一些不符合原生运行的设计，比如`js`的执行队列，这让`“环境不一致”`的情形雪上加霜
:::

微前端框架很难兼顾每一面的影响
## 谈不上乖巧的第三方
按`micro-app`发布的文章中说的，他们对于qiankun中的
1. 子应用改造（体验问题）
2. 沙箱隔离 （沙箱问题）
不太满意，所以搞出来个新东西。简而言之，即通过原型链的方式，将`document`操作隔离到`web component`中，用web component的生命周期 ，代替应用的生命周期钩子，内部还做了一些缓存的工作。这更接近组件化的模式，体验总归会好点 

请注意到一个点：用了webcomponent，那么肯定会考虑shadowRoot,但实际microapp官方并没有将shadowroot作为默认配置，

很多应用，比如说某个版本的react，在shadowroot中，会出问题，但显然react不是唯一会出问题的



## 自成一派的esm

我对这个东西本身没什么兴趣，它内部有点过于复杂了，唯一值得注意的是，garfish中有一个esmLoader，它为esm提供了环境变量，虽然这个方法在性能上已经不能用糟糕来形容，但至少，有人开始关注esm了。

严格来讲，虽然只提供了环境变量的功能，但esm的custom fetch思路已经初现端倪了。


## 业务的歧义
假设每一个依赖库都表现安分，我们可以放心大胆的在其上编写业务，那么设想以下情况：
1. 如在应用结束之前需要执行一个行为:作为子应用时，这个应用结束的时间，究竟是指主应用结束的时间，子应用卸载/隐藏的时间，还是子应用销毁的时间？
2. 子应用使用`location.href`跳转：在微前端中，是应该整个页面跳转，还是这个子应用部分跳转
3. 子应用使用`localStorage`储存鉴权信息时，是否应对子应用存的键安排一个命名空间，如果不是，那显然会导致失败的隔离，如果是，那么当子应用同域名的时候，可能导致重复鉴权
4. `document.onclick`,是监听整个文档点击事件，还是子应用所占区域的点击事件
5. 子应用请求的源，究竟应该是用主应用还是子应用的？
或许应用开发时开发者目标很明确，但当其作为子应用时，一些行为就存在歧义了
