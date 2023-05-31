# merak-helper
Used in subapplications


```ts
declare function $window(): Window
declare function $document(): Document
declare function $eventName(event: string): string
declare function isMerak(): boolean
declare function $body(): HTMLElement
declare function $head(): HTMLHeadElement
declare function $on(eventName: MerakEvent, cb: () => any): () => void
declare function $once(eventName: MerakEvent, cb: () => any): () => void
declare function $onMount(cb: () => any): any
declare function $onRelunch(cb: () => any): () => void
declare function $onHidden(cb: () => any): () => void
declare function $onDestroy(cb: () => any): () => void
declare function $onUnmount(cb: () => any): () => void
declare function $onExec(cb: () => any): () => void
declare function $sandbox(script: string): string
declare function $esm(script: string): string
declare function $instance(): Merak$1 | undefined
declare function $props<T = Record<string, any>>(): undefined | T
declare function $namespace(): Record<string, any> | undefined
declare function $perf(): merak_core.Perf | undefined
declare function $stopBubble(): void
```