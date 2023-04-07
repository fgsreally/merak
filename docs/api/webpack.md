```ts
declare class Merak {
  constructor(
    /**
     * 分配的全局变量名
     */
    fakeGlobalVar: string,
    /**
     * 隔离的全局变量
     */
    globals: string[],
    options?:
    | {
      /**
      * 需隔离的文件，默认为全部js
      */
      filter?: RegExp | undefined
      /**
      * 是否强制隔离，由于webpack开发时可能使用大量eval（devtool中的配置），merak会认为该环境中没有需要隔离的变量（实际上有，只不过是在*、* eval中，无法识别），该选项为true时，所有隔离的变量，无论环境中是否使用，均会被隔离
      */
      force?: boolean | undefined
    }
    | undefined
  )
  apply(compiler: Compiler): void
}
```
