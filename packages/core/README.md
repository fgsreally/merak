# merak-core
merak runtime in browser

1. create Merak Instance
spa example
```ts
import { PureLoader } from 'merak-core/loader'
import { Merak } from 'merak-core'

const loader = new PureLoader()//
const instance = new Merak(id, url, { loader })
```
```ts
import { SSRLoader } from 'merak-core/loader'
import { Merak } from 'merak-core'

const loader = new SSRLoader()//
const instance = new Merak(id, url, { loader })
```


2. mount custom element
```html
<merak-app data-merak-id="id"></merak-app>

```

## special mode

### keep-alive

store dom in memory
```html
<merak-app data-merak-id="id" keep-alive></merak-app>
```

### iframe

it will exec script in iframe
```ts
const instance = new Merak(id, url, { loader, iframe: iframeID })
```


## helper
```ts
getInstance(id)// get Merak instance
getHost(id)// get shadowroot host
```


## lifecycle
```ts
declare function beforeMount(cb: LifeCycle['beforeMount']): void
declare function beforeUnmount(cb: LifeCycle['beforeUnmount']): void
declare function afterUnmount(cb: LifeCycle['afterUnmount']): void
declare function destroy(cb: LifeCycle['destroy']): void
declare function transformScript(cb: LifeCycle['transformScript']): void
declare function tranformDocument(cb: LifeCycle['tranformDocument']): void
declare function errorHandler(cb: LifeCycle['errorHandler']): void
```

## perf
```ts
const app = getInstance(id)
app.perf.on('load', fn) // load template

app.perf.on('bootstrap', fn)// exec script
```
