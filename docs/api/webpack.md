# webpack-plugin-merak

```ts
declare class Merak {
  fakeGlobalVar: string
  options: {
    filter?: (file: string) => boolean
    force?: boolean
    logPath?: string
    isInLine?: boolean
    nativeVars?: string[]
    customVars?: string[]
    compileHtml?: boolean
  }
  constructor(fakeGlobalVar: string, options?: {
    // 需要被处理的文件
    filter?: (file: string) => boolean
    // 会将所有变量都隔离，而非根据ast按需隔离

    force?: boolean
    // 输出记录文件
    logPath?: string
    // 默认为compile，这对应不同的loader
    loader?: 'compile' | 'runtime'
    // 将信息输出为一个文件
    output?: string
    // 原生隔离变量
    nativeVars?: string[]
    // 自定义隔离变量

    customVars?: string[]

  })
  apply(compiler: Compiler): void
}
```
