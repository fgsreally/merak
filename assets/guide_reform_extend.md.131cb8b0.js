import{_ as s,o as n,c as a,Q as p}from"./chunks/framework.4b8f86ba.js";const _=JSON.parse('{"title":"继承","description":"","frontmatter":{},"headers":[],"relativePath":"guide/reform/extend.md","filePath":"guide/reform/extend.md","lastUpdated":1708420218000}'),l={name:"guide/reform/extend.md"},o=p(`<h1 id="继承" tabindex="-1">继承 <a class="header-anchor" href="#继承" aria-label="Permalink to &quot;继承&quot;">​</a></h1><p>通过继承<code>merak</code>类来扩展、修改功能，不推荐</p><blockquote><p>当然，这样工作量会大一点，比如<code>vue</code>组件就要重新封装了</p></blockquote><p>以前文的事件总线为例：</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">class</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">YourMerak</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">extends</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Merak</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#FFAB70;">emitter</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> emitter</span><span style="color:#6A737D;">// your event emitter</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">constuctor</span><span style="color:#E1E4E8;">(</span><span style="color:#6A737D;">/** */</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">super</span><span style="color:#E1E4E8;">(</span><span style="color:#6A737D;">/** */</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">on</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// ..</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">emit</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// ..</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">YourMerak</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">extends</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Merak</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#E36209;">emitter</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> emitter</span><span style="color:#6A737D;">// your event emitter</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">constuctor</span><span style="color:#24292E;">(</span><span style="color:#6A737D;">/** */</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">super</span><span style="color:#24292E;">(</span><span style="color:#6A737D;">/** */</span><span style="color:#24292E;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">on</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// ..</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">emit</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// ..</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div>`,5),e=[o];function t(c,r,E,y,i,d){return n(),a("div",null,e)}const m=s(l,[["render",t]]);export{_ as __pageData,m as default};
