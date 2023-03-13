export class LifeCycle {
  beforeMount: () => any
  afterMount: () => any
  beforeUnmount: () => any
  afterUnmount: () => any
  destroy: () => any
  execScript: (scripts: HTMLScriptElement[]) => void
  tranformTemplate: (ele: HTMLElement) => void
}
