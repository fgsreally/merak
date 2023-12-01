import{_ as e,o,c as d,a as c}from"./app.1ba86111.js";const f=JSON.parse('{"title":"微前端带来的新问题","description":"","frontmatter":{},"headers":[{"level":2,"title":"应用隔离","slug":"应用隔离","link":"#应用隔离","children":[]},{"level":2,"title":"模拟独立运行环境","slug":"模拟独立运行环境","link":"#模拟独立运行环境","children":[]},{"level":2,"title":"歧义性行为","slug":"歧义性行为","link":"#歧义性行为","children":[]}],"relativePath":"blog/question.md","lastUpdated":1701403370000}'),a={name:"blog/question.md"},t=c('<h1 id="微前端带来的新问题" tabindex="-1">微前端带来的新问题 <a class="header-anchor" href="#微前端带来的新问题" aria-hidden="true">#</a></h1><p><code>qiankun</code>文章中强调了<code>iframe</code>的问题，但是，不用<code>iframe</code>，同样也会产生问题 以下的情形在<code>iframe</code>中没有影响，但在微前端中却很折磨人</p><blockquote><p>这里说的微前端只算以兼容多个应用为目的的项目，如果只是追求共享依赖/数据，如模块联邦等，不算在内</p></blockquote><h2 id="应用隔离" tabindex="-1">应用隔离 <a class="header-anchor" href="#应用隔离" aria-hidden="true">#</a></h2><h2 id="模拟独立运行环境" tabindex="-1">模拟独立运行环境 <a class="header-anchor" href="#模拟独立运行环境" aria-hidden="true">#</a></h2><p>各种框架力求子应用独立运行时的环境，和作为子应用运行时的环境一致，但这也困难重重，举个例子，浏览器中是无法让一个<code>js</code>文件多次运行的,子应用单独运行时，我们可以刷新页面，用<code>iframe</code>加载时，我们可以卸下再重新挂载，但在微前端，只能利用暴露的钩子去加载or卸载，而我们往往在钩子里只让 <code>vue</code>实例挂载/卸载，但这是不够的，比如内部有个库可能存储了<code>dom</code>的状态，卸载时却没有释放，第二次加载时页面上是新的<code>dom</code>,而库还在控制上次的缓存。但在开发中我们往往很难意识到某个库做了这样的行为</p><blockquote><p>除此还有性能上的考虑，为了优化还要做一些不符合原生运行的设计，比如<code>js</code>的执行队列，这让<code>“环境不一致”</code>的情形更雪上加霜</p></blockquote><h2 id="歧义性行为" tabindex="-1">歧义性行为 <a class="header-anchor" href="#歧义性行为" aria-hidden="true">#</a></h2><p>因为独立运行，和作为子应用运行不可能等同，必然也会有歧义的行为，设想以下情况</p><ol><li>如在应用结束之前需要执行一个行为:作为子应用时，这个应用结束的时间，究竟是指主应用结束的时间，子应用卸载/隐藏的时间，还是子应用销毁的时间？</li><li>子应用使用<code>location.href</code>跳转：在微前端中，是应该整个页面跳转，还是这个子应用对应的位置跳转</li><li>子应用使用<code>localStorage</code>：在微前端中，是否应对子应用存的键安排一个命名空间，如果不是，那显然会导致失败的隔离，如果是，那么当子应用同域名的时候，可能导致重复鉴权</li><li><code>document.onclick</code>,是监听整个文档点击事件，还是子应用所占区域的点击事件</li></ol><p>微前端环境下，很多概念存在歧义，框架本身没有办法做出判断，需要自行在主应用和子应用处进行处理。此外，在应用代码中，我们可以手动声明，解决歧义，但依赖的库并不知道这一点。这也是爆发<code>bug</code>的一个常见的原因。</p>',11),i=[t];function l(r,n,s,h,_,p){return o(),d("div",null,i)}const m=e(a,[["render",l]]);export{f as __pageData,m as default};