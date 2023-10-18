# merak-core
merak runtime in browser

1. create Merak Instance
spa example
```ts
import { CompileLoader, Merak } from 'merak-core'

const loader = new CompileLoader()//
const instance = new Merak(id, url, { loader })
```
```ts
import { Merak, SSRLoader } from 'merak-core'

const loader = new SSRLoader()//
const instance = new Merak(id, url, { loader })
```


2. mount custom element
```html
<merak-app data-merak-id="id"></merak-app>

```








