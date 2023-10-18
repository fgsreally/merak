# 继承
通过继承`merak`类来扩展、修改功能
> 当然，这样工作量会大一点，比如`vue`组件就要重新封装了

以前文的事件总线为例：
```ts
class YourMerak extends Merak {
  public emitter = emitter// your event emitter
  constuctor(/** */) {
    super(/** */)

  }

  on() {
    // ..
  }

  emit() {
    // ..
  }

}
```