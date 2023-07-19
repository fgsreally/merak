import{_ as s,o as a,c as n,a as l}from"./app.59ef58dc.js";const C=JSON.parse('{"title":"快速上手","description":"","frontmatter":{"sidebarDepth":2,"collapsable":false},"headers":[{"level":2,"title":"设置子应用","slug":"设置子应用","link":"#设置子应用","children":[{"level":3,"title":"应用","slug":"应用","link":"#应用","children":[]},{"level":3,"title":"打包器","slug":"打包器","link":"#打包器","children":[]}]},{"level":2,"title":"设置主应用","slug":"设置主应用","link":"#设置主应用","children":[]}],"relativePath":"guide/quick-start.md","lastUpdated":1689754953000}'),p={name:"guide/quick-start.md"},o=l(`<h1 id="快速上手" tabindex="-1">快速上手 <a class="header-anchor" href="#快速上手" aria-hidden="true">#</a></h1><h2 id="设置子应用" tabindex="-1">设置子应用 <a class="header-anchor" href="#设置子应用" aria-hidden="true">#</a></h2><h3 id="应用" tabindex="-1">应用 <a class="header-anchor" href="#应用" aria-hidden="true">#</a></h3><p>以<code>vue</code>为例，</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">// in main.ts</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">$onExec</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">merak-helper</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#C792EA;">let</span><span style="color:#A6ACCD;"> app</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">AppType</span></span>
<span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">render</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">app</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">createApp</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">App</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">app</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">mount</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">#app</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#82AAFF;">$onExec</span><span style="color:#A6ACCD;">(render)</span><span style="color:#676E95;font-style:italic;">// 挂载时执行</span></span>
<span class="line"><span style="color:#82AAFF;">$onDestroy</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> app</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">unmount</span><span style="color:#A6ACCD;">())</span><span style="color:#676E95;font-style:italic;">// 卸载时执行</span></span>
<span class="line"></span></code></pre></div><h3 id="打包器" tabindex="-1">打包器 <a class="header-anchor" href="#打包器" aria-hidden="true">#</a></h3><p>需要根据打包器，安装<code>vite-plugin-merak</code>/<code>webpack-plugin-merak </code></p><p>以<code>vite</code>为例</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">Merak</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">vite-plugin-merak</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// https://vitejs.dev/config/</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">default</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">defineConfig</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">plugins</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [</span><span style="color:#82AAFF;">Merak</span><span style="color:#A6ACCD;">(fakeGlobalVar</span><span style="color:#676E95;font-style:italic;">/** 子应用专属的变量名 */</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> []</span><span style="color:#676E95;font-style:italic;">/** 额外需要被替换的全局变量 */</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;">)]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span></code></pre></div><blockquote><p><code>fakeGlobalVar</code>必须是一个合法的,未被占用的变量名,和<code>umd</code>中<code>library name</code>性质差不多</p></blockquote><blockquote><p><code>webpack</code>见<a href="./.html">example</a></p></blockquote><h2 id="设置主应用" tabindex="-1">设置主应用 <a class="header-anchor" href="#设置主应用" aria-hidden="true">#</a></h2><blockquote><p>创建<code>Merak</code>实例，必须先于html挂载</p></blockquote><p>以原生为例,在<code>js</code>中</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">Merak</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">merak-core</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">PureLoader</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">merak-core/loader</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">/** 设置加载器 */</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> loader </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">PureLoader</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">/** 设置子应用配置 */</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> app </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Merak</span><span style="color:#A6ACCD;">(name</span><span style="color:#676E95;font-style:italic;">/** 子应用name */</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> url</span><span style="color:#676E95;font-style:italic;">/** 子应用url */</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> loader </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span></code></pre></div><p>在<code>html</code>中</p><div class="language-html"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">merak-app</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">:data-merak-id</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">name</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;&lt;/</span><span style="color:#F07178;">merak-app</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span></code></pre></div>`,17),e=[o];function t(c,r,y,D,i,F){return a(),n("div",null,e)}const d=s(p,[["render",t]]);export{C as __pageData,d as default};
