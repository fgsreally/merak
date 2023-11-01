# cli
没有`webpack/vite`的时候,cli能帮到你
```shell
npm i merak-compile
```
创建文件 `merak.config.json`(可以通过`merak init`创建)
```json
{
  "$schema": "https://unpkg.com/merak-compile/assets/schema.json",
  "dir": ".",
  "globals": [],
  "fakeGlobalVar": "vanilla",
  "exclude": ["node_modules/**/*", "dist/**/*"],
  "format": "esm",
  "logPath": "./name.md",
  "isinLine": true
}
```
配置项和`vite/webpack`中一致

通过
```shell
npx merak
```

就可以将文件进行编译