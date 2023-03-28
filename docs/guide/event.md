## 事件总线

`merak`不提供事件总线，但实现它很容易

本质上就是有一个东西可以所有应用共享，可以这样
```ts
Merak.namespace.emitter = emitter// your event emitter
```
> Merak的静态属性，可以在多个应用中共享，[详见]()

也可以这样
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
    // ..S
  }

}
```