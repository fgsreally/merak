# esbuild-plugin-merak
only work for prod

```ts
declare function Merak(fakeGlobalVar: string, opts?: {
  exclude?: RegExp
  logPath?: string
  force?: boolean
  nativeVars?: string[]
  customVars?: string[]
  loader?: 'runtime' | 'compile'
}): Plugin
```