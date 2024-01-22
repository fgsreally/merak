import{_ as s,o as a,c as n,Q as p}from"./chunks/framework.435d96fe.js";const A=JSON.parse('{"title":"vue","description":"","frontmatter":{},"headers":[],"relativePath":"api/vue.md","filePath":"api/vue.md","lastUpdated":1705886350000}'),l={name:"api/vue.md"},o=p(`<h1 id="vue" tabindex="-1">vue <a class="header-anchor" href="#vue" aria-label="Permalink to &quot;vue&quot;">​</a></h1><h2 id="共有配置" tabindex="-1">共有配置 <a class="header-anchor" href="#共有配置" aria-label="Permalink to &quot;共有配置&quot;">​</a></h2><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">interface</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">ShareProps</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">name</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> { </span><span style="color:#6A737D;">// 即实例id，必填</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#FFAB70;">type</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">String</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">url</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> { </span><span style="color:#6A737D;">// 对应地址，必填</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#FFAB70;">type</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">String</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">props</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> { </span><span style="color:#6A737D;">// 传给子应用的数据</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#FFAB70;">type</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">PropType</span><span style="color:#E1E4E8;">&lt;</span><span style="color:#79B8FF;">any</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">proxy</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> { </span><span style="color:#6A737D;">// 使用的沙箱</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#FFAB70;">type</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">PropType</span><span style="color:#E1E4E8;">&lt;</span><span style="color:#B392F0;">ProxyGlobals</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">iframe</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> { </span><span style="color:#6A737D;">// iframeId</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#FFAB70;">type</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">String</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">timeout</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#FFAB70;">type</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Number</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">interface</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">ShareProps</span><span style="color:#24292E;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">name</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> { </span><span style="color:#6A737D;">// 即实例id，必填</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">type</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">String</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">url</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> { </span><span style="color:#6A737D;">// 对应地址，必填</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">type</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">String</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">props</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> { </span><span style="color:#6A737D;">// 传给子应用的数据</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">type</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">PropType</span><span style="color:#24292E;">&lt;</span><span style="color:#005CC5;">any</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">proxy</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> { </span><span style="color:#6A737D;">// 使用的沙箱</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">type</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">PropType</span><span style="color:#24292E;">&lt;</span><span style="color:#6F42C1;">ProxyGlobals</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">iframe</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> { </span><span style="color:#6A737D;">// iframeId</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">type</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">String</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">timeout</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">type</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Number</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="merakapp-的配置" tabindex="-1">MerakApp 的配置 <a class="header-anchor" href="#merakapp-的配置" aria-label="Permalink to &quot;MerakApp 的配置&quot;">​</a></h2><p>和<code>core</code>中配置一致</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">interface</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">MerakAppProps</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">extends</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">ShareProps</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">loaderOptions</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#FFAB70;">type</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">PropType</span><span style="color:#E1E4E8;">&lt;</span><span style="color:#79B8FF;">any</span><span style="color:#E1E4E8;">&gt;</span><span style="color:#6A737D;">// Merak实例的第三个参数</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">loader</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#FFAB70;">type</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">PropType</span><span style="color:#E1E4E8;">&lt;</span><span style="color:#B392F0;">Loader</span><span style="color:#E1E4E8;">&gt;</span><span style="color:#6A737D;">// loader，默认采用一个内置的pureloader</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">route</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#FFAB70;">type</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">String</span><span style="color:#6A737D;">// 跳转页面</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">interface</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MerakAppProps</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">extends</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">ShareProps</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">loaderOptions</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">type</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">PropType</span><span style="color:#24292E;">&lt;</span><span style="color:#005CC5;">any</span><span style="color:#24292E;">&gt;</span><span style="color:#6A737D;">// Merak实例的第三个参数</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">loader</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">type</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">PropType</span><span style="color:#24292E;">&lt;</span><span style="color:#6F42C1;">Loader</span><span style="color:#24292E;">&gt;</span><span style="color:#6A737D;">// loader，默认采用一个内置的pureloader</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">route</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">type</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">String</span><span style="color:#6A737D;">// 跳转页面</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="meraksrr" tabindex="-1">MerakSRR <a class="header-anchor" href="#meraksrr" aria-label="Permalink to &quot;MerakSRR&quot;">​</a></h2><p>和<code>MerakApp</code>一样</p><h2 id="merakimport-merakscope" tabindex="-1">MerakImport/MerakScope <a class="header-anchor" href="#merakimport-merakscope" aria-label="Permalink to &quot;MerakImport/MerakScope&quot;">​</a></h2><p><a href="https://github.com/fgsreally/merak/blob/main/packages/vue/src/block.ts" target="_blank" rel="noreferrer">详见</a></p>`,10),e=[o];function r(t,c,y,E,i,F){return a(),n("div",null,e)}const h=s(l,[["render",r]]);export{A as __pageData,h as default};
