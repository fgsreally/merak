import{_ as s,o as a,c as n,Q as o}from"./chunks/framework.435d96fe.js";const h=JSON.parse('{"title":"热更新","description":"","frontmatter":{},"headers":[],"relativePath":"guide/hmr.md","filePath":"guide/hmr.md","lastUpdated":1705851246000}'),p={name:"guide/hmr.md"},e=o(`<h1 id="热更新" tabindex="-1">热更新 <a class="header-anchor" href="#热更新" aria-label="Permalink to &quot;热更新&quot;">​</a></h1><blockquote><p>已对<code>vue/react</code>框架处理</p></blockquote><p>在开发时，视图框架会注入一些变量用于热更新 注入时有可能会被沙箱隔离掉</p><blockquote><p>取决于框架热更新的实现，有可能有问题，也有可能没有</p></blockquote><p>这个时候需要允许这些变量挂载到全局</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">// work for react</span></span>
<span class="line"><span style="color:#B392F0;">addWindowVar</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;$RefreshSig$&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#B392F0;">addWindowVar</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;$RefreshReg$&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#6A737D;">// work for vue</span></span>
<span class="line"><span style="color:#B392F0;">addWindowVar</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;__VUE_HMR_RUNTIME__&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#B392F0;">addWindowVar</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;_<wbr>_VUE_OPTIONS_API__&#39;</span><span style="color:#E1E4E8;">)</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">// work for react</span></span>
<span class="line"><span style="color:#6F42C1;">addWindowVar</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;$RefreshSig$&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#6F42C1;">addWindowVar</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;$RefreshReg$&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#6A737D;">// work for vue</span></span>
<span class="line"><span style="color:#6F42C1;">addWindowVar</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;__VUE_HMR_RUNTIME__&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#6F42C1;">addWindowVar</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;_<wbr>_VUE_OPTIONS_API__&#39;</span><span style="color:#24292E;">)</span></span></code></pre></div><p>如果是其他框架，看框架的热更新变量名，然后同上述方法就好</p>`,7),l=[e];function r(t,c,d,i,_,E){return a(),n("div",null,l)}const u=s(p,[["render",r]]);export{h as __pageData,u as default};