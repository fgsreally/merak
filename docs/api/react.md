# react

## MerakApp

```ts
// 含义与vue相同
type MerakApp = {
  name: string
  url: string
  props: any
  inlineStyle?: boolean
  proxy?: ProxyFactory
  flag?: string
  iframe?: string
  timeout?: number
  loaderOptions?: any
  loader?: Loader
  route?: string
  ssr?: boolean
} & Partial<Merak['lifeCycle']>
```


## MerakImport/MerakScope

[详见](https://github.com/fgsreally/merak/blob/main/packages/react/src/block.ts)
