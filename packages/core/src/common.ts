export const MERAK_DATA_ID = 'data-merak-id'
export const MERAK_KEEP_ALIVE = 'keep-alive'
export const MERAK_EVENT_PREFIX = 'merak_'

export enum MERAK_EVENT {
  RELUNCH = 'merak_relunch',
  MOUNT = 'merak_mount',
  HIDDEN = 'merak_hidden',
  SHOW = 'merak_show',
  DESTROY = 'merak_destroy',
  UNMOUNT = 'merak_unmount',
}

export enum MERAK_HOOK {
  LOAD = 'load',
  BEFORE_MOUNT = 'beforeMount',
  AFTER_MOUNT = 'afterMount',
  TRANSFORM_DOCUMENT = 'tranformDocument',
  BEFORE_UNMOUNT = 'beforeUnmount',
  AFTER_UNMOUNT = 'afterUnmount',
  DESTROY = 'destroy',
  TRANSFORM_SCRIPT = 'transformScript',
}

export const MERAK_SHADE_STYLE = 'position: fixed; z-index: 111111111; visibility: hidden; inset: 0px; backface-visibility: hidden;'

export enum PERF_TIME {
  LOAD = 'load',
  BOOTSTRAP = 'bootstrap',
}
