import{_ as s,o as a,c as o,Q as n}from"./chunks/framework.435d96fe.js";const h=JSON.parse('{"title":"debug/error","description":"","frontmatter":{},"headers":[],"relativePath":"guide/debug.md","filePath":"guide/debug.md","lastUpdated":1705850584000}'),e={name:"guide/debug.md"},p=n(`<h1 id="debug-error" tabindex="-1">debug/error <a class="header-anchor" href="#debug-error" aria-label="Permalink to &quot;debug/error&quot;">​</a></h1><h2 id="runtime-debug" tabindex="-1">runtime debug <a class="header-anchor" href="#runtime-debug" aria-label="Permalink to &quot;runtime debug&quot;">​</a></h2><p>开启调试模式</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">window.</span><span style="color:#79B8FF;">MERAK_DEBUG</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">true</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">window.</span><span style="color:#005CC5;">MERAK_DEBUG</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span></span></code></pre></div><p>可在控制台verbose看到调试信息，主要是沙箱的运行情况</p><h2 id="runtime-error" tabindex="-1">runtime error <a class="header-anchor" href="#runtime-error" aria-label="Permalink to &quot;runtime error&quot;">​</a></h2><p>错误处理有两种：公共的和专属的</p><h3 id="公共" tabindex="-1">公共 <a class="header-anchor" href="#公共" aria-label="Permalink to &quot;公共&quot;">​</a></h3><p>当没有示例专属的错误处理时，就会直接调用类上的静态函数，即公共的错误处理</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">Merak.</span><span style="color:#B392F0;">errorHandler</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> (</span><span style="color:#FFAB70;">opts</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> { </span><span style="color:#FFAB70;">type</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">string</span><span style="color:#E1E4E8;">; </span><span style="color:#FFAB70;">error</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Error</span><span style="color:#E1E4E8;">; </span><span style="color:#FFAB70;">instance</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Merak</span><span style="color:#E1E4E8;"> }) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">Merak.</span><span style="color:#6F42C1;">errorHandler</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">opts</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> { </span><span style="color:#E36209;">type</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">string</span><span style="color:#24292E;">; </span><span style="color:#E36209;">error</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Error</span><span style="color:#24292E;">; </span><span style="color:#E36209;">instance</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Merak</span><span style="color:#24292E;"> }) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="专属" tabindex="-1">专属 <a class="header-anchor" href="#专属" aria-label="Permalink to &quot;专属&quot;">​</a></h3><p>如果某个子应用需要特殊的错误监控</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">getInstance</span><span style="color:#E1E4E8;">(id).</span><span style="color:#B392F0;">errorHandler</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> (</span><span style="color:#FFAB70;">opt</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> { </span><span style="color:#FFAB70;">type</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">string</span><span style="color:#E1E4E8;">; </span><span style="color:#FFAB70;">error</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Error</span><span style="color:#E1E4E8;"> }) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">getInstance</span><span style="color:#24292E;">(id).</span><span style="color:#6F42C1;">errorHandler</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">opt</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> { </span><span style="color:#E36209;">type</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">string</span><span style="color:#24292E;">; </span><span style="color:#E36209;">error</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Error</span><span style="color:#24292E;"> }) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><blockquote><p>默认会输出错误信息，但不会抛出错误！ 错误处理主要是服务监控系统</p></blockquote><h2 id="compile-debug" tabindex="-1">compile debug <a class="header-anchor" href="#compile-debug" aria-label="Permalink to &quot;compile debug&quot;">​</a></h2><p>在vite/webpack/cli中设置<code>logPath</code>,它会产生一个含有调试信息的<code>md</code>文件，包括隔离了哪些变量、有哪些可能会有问题（eval）</p><div class="info custom-block"><p class="custom-block-title">变量不被隔离</p><p>如果希望某个函数使用的<code>document</code>不被隔离，但没法引入<code>merak-helper</code> 那么可以在变量前添加:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">/** </span><span style="color:#F97583;">@merak</span><span style="color:#6A737D;"> */</span><span style="color:#E1E4E8;">document</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">/** </span><span style="color:#D73A49;">@merak</span><span style="color:#6A737D;"> */</span><span style="color:#24292E;">document</span></span></code></pre></div><blockquote><p>必须要一模一样,不能有多余空格 这主要对于<code>npm</code>包，建议与<code>patch-package</code>共用</p></blockquote><p>隔离是隔离变量上的所有属性和方法，但有的时候硬需要变量本身，比如<code>observe(document)</code>，没法隔离，只能这样解决。</p></div>`,17),l=[p];function r(t,c,i,d,y,E){return a(),o("div",null,l)}const g=s(e,[["render",r]]);export{h as __pageData,g as default};
