import{_ as s,o as a,c as e,a as n}from"./app.7359a12a.js";const D=JSON.parse('{"title":"销毁","description":"","frontmatter":{},"headers":[],"relativePath":"guide/deactive.md","lastUpdated":1698487972000}'),o={name:"guide/deactive.md"},t=n(`<h1 id="销毁" tabindex="-1">销毁 <a class="header-anchor" href="#销毁" aria-hidden="true">#</a></h1><p>微前端的应用销毁一直是个麻烦的地方</p><p>默认情况下,<code>merak</code>只会执行钩子，并把dom放进缓存，事件也没有清除（姑且可以理解为<code>keep-alive</code></p><p>当需要再彻底一点的清除，这个时候在卸载钩子中：</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#82AAFF;">$onUnmount</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// ..</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#82AAFF;">$deactive</span><span style="color:#F07178;">()</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span></code></pre></div><p>这样会彻底清除<code>dom</code>以及事件</p>`,6),p=[t];function l(c,r,d,i,_,y){return a(),e("div",null,p)}const F=s(o,[["render",l]]);export{D as __pageData,F as default};
