export class LifeCycle {
  beforeMount: () => any
  afterMount: () => any
  beforeUnmount: () => any
  afterUnmount: () => any
  destroy: () => any
  execScript: (scripts: HTMLScriptElement[]) => void
  tranformDocument: (ele: HTMLElement) => void
}
