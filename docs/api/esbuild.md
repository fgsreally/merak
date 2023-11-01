# esbuild-plugin-merak(wip)
> 由于esbuild没有默认的`html`和`publicpath`处理，建议使用脚本[命令行工具](./cli.md)代替

```ts
// 配置和vite一致
declare function Merak(fakeGlobalVar: string, opts?: {
  output?: string
  includes?: FilterPattern
  exclude?: FilterPattern
  logPath?: string
  force?: boolean
  nativeVars?: string[]
  customVars?: string[]
  loader?: 'compile' | 'runtime'
}): PluginOption
```