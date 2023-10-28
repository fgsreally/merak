import{_ as e,o,c as t,a as c}from"./app.7359a12a.js";const g=JSON.parse('{"title":"简介","description":"","frontmatter":{"sidebarDepth":2},"headers":[{"level":3,"title":"feature","slug":"feature","link":"#feature","children":[]}],"relativePath":"guide/index.md","lastUpdated":1698487972000}'),i={name:"guide/index.md"},r=c('<h1 id="简介" tabindex="-1">简介 <a class="header-anchor" href="#简介" aria-hidden="true">#</a></h1><p>一款基于编译，剑走偏锋的微前端方案，你可以在此基础上开发独属于你自己的微前端框架</p><h3 id="feature" tabindex="-1">feature <a class="header-anchor" href="#feature" aria-hidden="true">#</a></h3><ul><li><p><strong>体积小</strong> 运行时无其他依赖</p></li><li><p><strong>高性能</strong> 没有<code>iframe</code>，没有<code>with</code>，没有<code>eval</code>，没有<code>new Function</code>,应该是最理想的状态了</p></li><li><p><strong>自定义沙箱</strong> 可以禁用/添加/重写子应用功能, 也可为不同子应用设置不同规则，从而<code>让其往东只能往东</code></p></li><li><p><strong>样式隔离</strong> 无需约定样式前缀，弹窗等隔离均有效</p></li><li><p><strong>支持 ESM</strong> 并非<code>兼容</code>，而是<code>优先支持</code></p></li><li><p><strong>支持 ssr/库模式</strong> 不止于管理系统</p></li><li><p><strong>易于改造</strong> 可开箱即用，也可自由改造，</p></li></ul><div class="tip custom-block"><p class="custom-block-title">help</p><p>天璇存在多个可自行改造/替换的环节， 可以通过继承增加/更改实例的功能，可以自定义沙箱决定隔离效果， 也可以在编译时加入自己需要的效果。</p><p>使用者可以自行设计自己版本的天璇，以迎合需求。所以，天璇更像是一个引擎/方案而非封闭的框架</p></div><div class="warning custom-block"><p class="custom-block-title">warn</p><p>由于 Merak 特殊的运作原理，请注意</p><ol><li>merak 没有<code>custom fetch</code>，</li><li>merak 基于 <code>webcomponent</code>和<code>proxy</code>，请考虑兼容性,</li><li>非严格隔离，如子应用中 eval 内部/动态生成的<code>script</code>/this，需要额外处理。</li><li>需要编译流程配合</li></ol></div><br><blockquote><p>说个题外话，在我截取图标时，智能识图没有很好的移除背景，能看到一些块体没有去掉。<br>原本我想重截取一张，但发现这些块体在亮色模式中不明显，但在暗色模式下却极亮，很符合天璇<code>基于编译</code>、<code>在看不到的地方发劲</code>的设计思路，故而保留</p></blockquote>',8),d=[r];function a(s,l,n,p,_,u){return o(),t("div",null,d)}const f=e(i,[["render",a]]);export{g as __pageData,f as default};
