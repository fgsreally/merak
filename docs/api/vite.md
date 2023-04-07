```ts
declare function Merak(
  fakeGlobalVar: string,
  globals: string[],
  opts: {
    // 是否使用行内模式，默认为true
    isinLine?: boolean
    // 包括的文件
    includes?: FilterPattern
    // 排除的文件
    exclude?: FilterPattern
    // 是否开启调试模式
    debug?: boolean
  }
)
```
