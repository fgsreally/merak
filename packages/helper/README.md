# merak-helper
Used in subapplications


```ts
type MerakEvent = 'mount' | 'destroy' | 'hidden' | 'unmount' | 'relunch' | 'show'
declare const isMerak: boolean
declare function $window(): Window
declare function $document(): Document
declare function $history(): History
declare function $location(): Location
declare function getInstance(id: string): any
declare function $jump(project: string, to: string): void
declare function $eventName(event: string): string
declare function $base(): string
declare function $body(): HTMLElement
declare function $head(): HTMLHeadElement
declare function $on(eventName: MerakEvent, cb: (flag?: string) => any): () => void
declare function $once(eventName: MerakEvent, cb: (flag?: string) => any): () => void
declare function $onMount(cb: (flag?: string) => any): any
declare function $onUnmount(cb: (flag?: 'destroy' | string) => any): () => void
declare function $sandbox(script: string): string
declare function $esm(script: string): string
declare function $instance(): Merak<merak_core.Loader>
declare function $props(): Props
declare function $props<K extends keyof Props>(key: string): Props[K]
declare function $namespace(): NameSpace
declare function $namespace<K extends keyof NameSpace>(key: string): NameSpace[K]
declare function $perf(): merak_core.Perf
declare function $stopBubble(isPass?: boolean): void
declare function $deactive(): void
declare function $destroy(): void
```