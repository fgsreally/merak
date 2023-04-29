# vite-plugin-merak


```ts
import { Merak, merakPostCss } from 'vite-plugin-merak'
export default {
  plugins: [Merak(id, [...globals])],

  css: {
    postcss: {
      plugins: [merakPostCss()],
    },
  },
}
```

