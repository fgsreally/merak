# merak-compile
provide compilation function to plugin and cli


## cli
create `merak.config.json`
```json
{
  "dir": ".",
  "globals": [],
  "fakeGlobalVar": "fakeGlobalVar",
  "exclude": ["node_modules/**/*", "dist/**/*"],
  "format": "esm",
  "logPath": "./name.md"
}
```

```shell
 merak 
```
it will parse files to merak-mode and output to outDir


### functions
```ts
declare const analyseHTML: (code: string) => [number, number][]

declare function resolveHtmlConfig(html: string): {
  html: string
  config: undefined
}

declare function compileHTML(code: string, baseUrl: string, loc: [number, number][]): string

declare function injectGlobalToIIFE(code: string, globalVar: string, globals: string[], force?: boolean): {
  code: string
  map: magic_string.SourceMap
  warning: {
    info: string
    loc: SourceLocation
  }[]
  globals: string[]
}

declare function injectGlobalToESM(code: string, globalVar: string, globals: string[], force?: boolean): {
  code: string
  map: magic_string.SourceMap
  warning: {
    info: string
    loc: SourceLocation
  }[]
  globals: string[]
}
```

### ssr

```ts
declare function wrap(html: string, url: string): string
declare class SsrTransformer extends Transform {
  readonly url: string
  templateAttrs: Record<string, string>
  private parser
  constructor(url: string, templateAttrs: Record<string, string>)
  _transform(chunk: any, encoding: string, callback: () => void): void
}
```


### css

```ts
declare function merakPostCss(): {
  postcssPlugin: string
  Root(root: any): void
}
```