import{_ as e,o as s,c as a,Q as o}from"./chunks/framework.b57a1379.js";const h=JSON.parse('{"title":"销毁","description":"","frontmatter":{},"headers":[],"relativePath":"guide/deactive.md","filePath":"guide/deactive.md","lastUpdated":1707665544000}'),n={name:"guide/deactive.md"},p=o(`<h1 id="销毁" tabindex="-1">销毁 <a class="header-anchor" href="#销毁" aria-label="Permalink to &quot;销毁&quot;">​</a></h1><blockquote><p>微前端的应用销毁一直是个麻烦的地方</p></blockquote><p>默认情况下,<code>merak</code>只会执行钩子，并把dom放进缓存，事件也没有清除</p><p>当需要再彻底一点的清除，这个时候在卸载钩子中：</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { $deactive, $onUnmount } </span><span style="color:#F97583;">from</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;merak-helper&#39;</span></span>
<span class="line"><span style="color:#B392F0;">$onUnmount</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// ..</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">$deactive</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> { $deactive, $onUnmount } </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;merak-helper&#39;</span></span>
<span class="line"><span style="color:#6F42C1;">$onUnmount</span><span style="color:#24292E;">(() </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// ..</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">$deactive</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">})</span></span></code></pre></div><p>这样会彻底清除<code>dom</code>以及事件</p><h3 id="进阶" tabindex="-1">进阶 <a class="header-anchor" href="#进阶" aria-label="Permalink to &quot;进阶&quot;">​</a></h3><p>上述的经验足以应付大多数情况，但如果有进一步的需求有必要了解一下原理：</p><p><code>merak</code>只会通知你<code>挂载/卸载</code>,并不会帮你做任何事情，</p><p>你应该手动在钩子中进行挂载、卸载的准备</p><p><code>merak-helper</code>会提供连两个帮助函数：<code>$deactive</code>,<code>$destroy</code>，前者是将现有的<code>dom</code>转为<code>innerHtml</code>（<code>webpack</code>在开发时<code>style-loader</code>就会导致问题，详见<code>issue</code>），</p><p>而后者则是完全删除<code>merak</code>实例(尽量不要使用，我个人认为它完全没有任何良性的作用)。</p><p>这两者都不一定可靠！</p><p>如果出现完全无法解决的问题，请考虑使用<a href="./mode.html#iframe模式">iframe模式</a>，每一个应用单独享有一个<code>iframe</code>，卸载时<code>iframe</code>销毁，和无界的重建模式一致</p><div class="info custom-block"><p class="custom-block-title">INFO</p><p>重建模式并非是一件没有意义的事情（虽然性能确实会接近<code>iframe</code>）</p><p>相比于使用<code>iframe</code>，至少有可操作的<code>dom</code>，弹窗等全局样式，方便的状态、方法共享，不用考虑同源...</p><p>更关键的是，很多其他工具，如可视化测试、录屏，均不支持<code>iframe</code></p></div>`,15),c=[p];function l(t,d,r,i,m,E){return s(),a("div",null,c)}const _=e(n,[["render",l]]);export{h as __pageData,_ as default};
