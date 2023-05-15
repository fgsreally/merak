# merak中对于歧义行为的处理
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