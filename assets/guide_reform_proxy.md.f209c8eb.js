import{_ as s,o as a,c as n,a as l}from"./app.59ef58dc.js";const C=JSON.parse('{"title":"沙箱","description":"","frontmatter":{},"headers":[{"level":2,"title":"默认规则","slug":"默认规则","link":"#默认规则","children":[]},{"level":2,"title":"自定义规则","slug":"自定义规则","link":"#自定义规则","children":[]}],"relativePath":"guide/reform/proxy.md","lastUpdated":1689754953000}'),o={name:"guide/reform/proxy.md"},p=l(`<h1 id="沙箱" tabindex="-1">沙箱 <a class="header-anchor" href="#沙箱" aria-hidden="true">#</a></h1><p>默认隔离的变量有<code>document</code>,<code>window</code>,<code>self</code>,<code>history</code>,<code>location</code> 其他需要隔离的变量，必须标明在子应用的插件中，</p><h2 id="默认规则" tabindex="-1">默认规则 <a class="header-anchor" href="#默认规则" aria-hidden="true">#</a></h2><p>详见<a href="./.html">源码</a></p><h2 id="自定义规则" tabindex="-1">自定义规则 <a class="header-anchor" href="#自定义规则" aria-hidden="true">#</a></h2><p>可以对规则进行更改 本质就是自己写一个<a href="./.html">createProxy</a>,然后在创建对象时往里面传</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> customProxy </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">document</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">get</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">target</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">p</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">p</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">===</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">test</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">test</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// ..</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> app </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Merak</span><span style="color:#A6ACCD;">(name</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> url</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">proxy</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> customProxy </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span></code></pre></div><p>子应用中</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#A6ACCD;"> (window</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">$Merak)</span></span>
<span class="line"><span style="color:#A6ACCD;">  document</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">test</span><span style="color:#676E95;font-style:italic;">// &#39;test&#39;</span></span>
<span class="line"></span></code></pre></div>`,9),e=[p];function t(c,r,y,D,i,F){return a(),n("div",null,e)}const A=s(o,[["render",t]]);export{C as __pageData,A as default};
