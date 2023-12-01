import{_ as s,o as a,c as n,a as o}from"./app.1ba86111.js";const D=JSON.parse('{"title":"热更新","description":"","frontmatter":{},"headers":[],"relativePath":"guide/hmr.md","lastUpdated":1701403370000}'),l={name:"guide/hmr.md"},p=o(`<h1 id="热更新" tabindex="-1">热更新 <a class="header-anchor" href="#热更新" aria-hidden="true">#</a></h1><blockquote><p>已对<code>vue/react</code>框架处理</p></blockquote><p>在开发时，视图框架会注入一些变量用于热更新 注入时有可能会被沙箱隔离掉</p><blockquote><p>取决于框架热更新的实现，有可能有问题，也有可能没有</p></blockquote><p>这个时候需要允许这些变量挂载到全局</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#A6ACCD;"> (__DEV__) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// work for react</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#82AAFF;">addWindowVar</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">$RefreshSig$</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#82AAFF;">addWindowVar</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">$RefreshReg$</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// work for vue</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#82AAFF;">addWindowVar</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">__VUE_HMR_RUNTIME__</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#82AAFF;">addWindowVar</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">_<wbr>_VUE_OPTIONS_API__</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>如果是其他框架，看框架的热更新变量名，然后同上述方法就好</p>`,7),e=[p];function t(c,r,i,F,_,y){return a(),n("div",null,e)}const h=s(l,[["render",t]]);export{D as __pageData,h as default};