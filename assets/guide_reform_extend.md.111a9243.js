import{_ as s,o as n,c as a,a as l}from"./app.c7c475cc.js";const A=JSON.parse('{"title":"继承","description":"","frontmatter":{},"headers":[],"relativePath":"guide/reform/extend.md","lastUpdated":1703924165000}'),p={name:"guide/reform/extend.md"},e=l(`<h1 id="继承" tabindex="-1">继承 <a class="header-anchor" href="#继承" aria-hidden="true">#</a></h1><p>通过继承<code>merak</code>类来扩展、修改功能</p><blockquote><p>当然，这样工作量会大一点，比如<code>vue</code>组件就要重新封装了</p></blockquote><p>以前文的事件总线为例：</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">YourMerak</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">extends</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Merak</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">emitter</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> emitter</span><span style="color:#676E95;font-style:italic;">// your event emitter</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">constuctor</span><span style="color:#89DDFF;">(</span><span style="color:#676E95;font-style:italic;">/** */</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">super</span><span style="color:#F07178;">(</span><span style="color:#676E95;font-style:italic;">/** */</span><span style="color:#F07178;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">on</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// ..</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">emit</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// ..</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div>`,5),o=[e];function t(c,r,y,i,D,F){return n(),a("div",null,o)}const d=s(p,[["render",t]]);export{A as __pageData,d as default};
