# 应用隔离
微前端中沙箱十分重要，但这里的沙箱并不是单指`js`沙箱(实际上真的不重要，如果使用`ESM`开发，没有什么人会天天往`window`上面挂东西的)，而是指当子应用销毁时，沙箱能让子应用带来的一切影响结束，这种影响包括`dom`,`内存`,`样式`等等，微前端框架是很难兼顾每一面的（除了纯粹使用`iframe`），其中`内存`问题尤为难搞，大部分微前端框架需要暴露钩子，请在钩子中及时释放内存

# 模拟独立运行环境
实际上绝大部分微前端
# 歧义性行为
设想以下情况
1. 如在应用结束之前需要执行一个行为:作为子应用时，这个应用结束的时间，究竟是指主应用结束的时间，子应用卸载/隐藏的时间，还是子应用销毁的时间？
2. 子应用使用`location.href`跳转：在微前端中，是应该整个页面跳转，还是这个子应用对应的位置跳转
3. 子应用使用`localStorage`：在微前端中，是否应对子应用存的键安排一个命名空间，如果不是，那显然会导致失败的隔离，如果是，那么当子应用同域名的时候，可能导致重复鉴权
4. `document.onclick`,是监听整个文档点击事件，还是子应用所占区域的点击事件

微前端环境下，很多概念存在歧义，这也是爆发`bug`的一个可能的原因。框架本身没有办法做出判断，开发者需要在主应用和子应用处进行处理

比如点击事件，在子应用中，需要类似的判断：
```ts
if (window.$Merak)
  document.onlick = xx

else
  document.body.onlick
```
> 当然这只是一个易于理解的例子，实际上可能只需要点击文档就够了

有时候可能需要在主应用做处理
比如`window.addEventListener('load')`,由于应用已经加载，子应用中的`load`事件无论如何都不会再触发
可以通过手动触发
```ts
const app = new Merak(/** .. */)
// ...
const event = new CustomEvent('load')
app.proxy.dispatchEvent(event)
```
也可以在[更改沙箱规则]()

```ts
function createProxyWindow() {
  return {
    get(target: Window, p: keyof Window) {
      if (p === 'addEventListener') {
        return (...params: Parameters<typeof addEventListener>) => {
          const eventName = params[0]
          if (eventName === 'load') {
            // ...
          }
          else { addEventListener(...params) }
        }
      }
      // ...
    }
  }
}
```
