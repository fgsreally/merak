import{_ as s,o as a,c as n,a as l}from"./app.7359a12a.js";const F=JSON.parse('{"title":"基础功能","description":"","frontmatter":{},"headers":[{"level":2,"title":"数据/功能共享","slug":"数据-功能共享","link":"#数据-功能共享","children":[]},{"level":2,"title":"事件总线","slug":"事件总线","link":"#事件总线","children":[]},{"level":2,"title":"路由","slug":"路由","link":"#路由","children":[]}],"relativePath":"guide/base.md","lastUpdated":1698487972000}'),p={name:"guide/base.md"},o=l(`<h1 id="基础功能" tabindex="-1">基础功能 <a class="header-anchor" href="#基础功能" aria-hidden="true">#</a></h1><h2 id="数据-功能共享" tabindex="-1">数据/功能共享 <a class="header-anchor" href="#数据-功能共享" aria-hidden="true">#</a></h2><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">// 主应用中</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> app </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Merak</span><span style="color:#A6ACCD;">(</span><span style="color:#676E95;font-style:italic;">/** */</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">app</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">props</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">test</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">test</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span></code></pre></div><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">// 子应用中</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#A6ACCD;"> (window</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">$Merak)</span></span>
<span class="line"><span style="color:#A6ACCD;">  window</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">$Merak</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">props</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">test</span><span style="color:#A6ACCD;">()</span><span style="color:#676E95;font-style:italic;">// output:test</span></span>
<span class="line"></span></code></pre></div><h2 id="事件总线" tabindex="-1">事件总线 <a class="header-anchor" href="#事件总线" aria-hidden="true">#</a></h2><p><code>merak</code>不提供事件总线，但实现它很容易。本质上就是有一个东西可以所有应用共享，可以通过静态属性实现</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">Merak</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">namespace</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">emitter </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> emitter</span><span style="color:#676E95;font-style:italic;">// your event emitter</span></span>
<span class="line"></span></code></pre></div><blockquote><p>Merak的静态属性，可以在多个应用中共享</p></blockquote><h2 id="路由" tabindex="-1">路由 <a class="header-anchor" href="#路由" aria-hidden="true">#</a></h2><p>简而言之，至少在默认配置下，<code>merak</code>的很多表现和无界几乎一致，路由也沿袭着<code>query</code>的模式,</p><div class="info custom-block"><p class="custom-block-title">路由跳转</p><p>跳转到指定应用的指定路由</p><p>这根视图框架中的路由原理有关，不一定起效</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">$$jump</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">merak-core</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">$jump</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">merak-helper</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 主应用中</span></span>
<span class="line"><span style="color:#82AAFF;">$$jump</span><span style="color:#A6ACCD;">(id</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> route)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 子应用中</span></span>
<span class="line"><span style="color:#82AAFF;">$jump</span><span style="color:#A6ACCD;">(id</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> route)</span></span>
<span class="line"></span></code></pre></div></div><blockquote><p>这并非一定，可以通过沙箱进行修改</p></blockquote>`,12),e=[o];function t(c,r,i,y,D,A){return a(),n("div",null,e)}const d=s(p,[["render",t]]);export{F as __pageData,d as default};
