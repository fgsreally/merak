# vite-plugin-merak
```ts
// 配置和webpack相似
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
