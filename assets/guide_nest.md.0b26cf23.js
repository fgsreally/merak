import{_ as e,o as a,c as s,a as t}from"./app.59ef58dc.js";const g=JSON.parse('{"title":"共有依赖和嵌套使用","description":"","frontmatter":{},"headers":[{"level":2,"title":"共有依赖","slug":"共有依赖","link":"#共有依赖","children":[]},{"level":2,"title":"子应用嵌套","slug":"子应用嵌套","link":"#子应用嵌套","children":[]}],"relativePath":"guide/nest.md","lastUpdated":1689754953000}'),n={name:"guide/nest.md"},o=t(`<h1 id="共有依赖和嵌套使用" tabindex="-1">共有依赖和嵌套使用 <a class="header-anchor" href="#共有依赖和嵌套使用" aria-hidden="true">#</a></h1><h2 id="共有依赖" tabindex="-1">共有依赖 <a class="header-anchor" href="#共有依赖" aria-hidden="true">#</a></h2><p>使用cdn，子应用中加上<code>merak-ignore</code>即可 即</p><div class="language-html"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">script</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">src</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">xx</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">merak-ignore</span><span style="color:#89DDFF;">&gt;&lt;/</span><span style="color:#F07178;">script</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span></code></pre></div><div class="warning custom-block"><p class="custom-block-title">提醒</p><p>需要注意的是，共有依赖，也就是cdn中的功能，都<strong>无法</strong>进行隔离，</p><p>共享依赖，意味着多个应用都会调用，具备隔离性就没意义了。所有微前端方案均是如此</p><p>不过需要注意的是，共享依赖必须要是和全局无关的，如果依赖了<code>document</code>之类,会很危险</p></div><h2 id="子应用嵌套" tabindex="-1">子应用嵌套 <a class="header-anchor" href="#子应用嵌套" aria-hidden="true">#</a></h2><p>子应用嵌套时，<code>merak-core</code>的依赖务必使用共有依赖,主子应用的<code>merak-core</code>必须用的是同一个。<a href="https://github.com/fgsreally/merak/tree/main/examples/main-nest/vite.config.ts" target="_blank" rel="noreferrer">详见</a> 其次，不同应用必须要分配不同的<code>id</code>，不能重名</p>`,7),l=[o];function r(c,p,i,d,h,_){return a(),s("div",null,l)}const u=e(n,[["render",r]]);export{g as __pageData,u as default};
