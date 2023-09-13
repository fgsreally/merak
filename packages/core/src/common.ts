export const MERAK_DATA_ID = 'data-merak-id'
export const MERAK_EVENT_PREFIX = 'merak_'
export const MERAK_FLAG = 'data-merak-flag'

export enum MERAK_EVENT {
  MOUNT = 'merak_mount',

  UNMOUNT = 'merak_unmount',
}

export enum MERAK_CYCLE {
  LOAD = 'load',
  BEFORE_MOUNT = 'beforeMount',
  AFTER_MOUNT = 'afterMount',
  TRANSFORM_DOCUMENT = 'tranformDocument',
  BEFORE_UNMOUNT = 'beforeUnmount',
  AFTER_UNMOUNT = 'afterUnmount',
  DEACTIVE = 'deactive',
  TRANSFORM_SCRIPT = 'transformScript',
}

export const MERAK_SHADE_STYLE = 'position: fixed; z-index: 111111111; visibility: hidden; inset: 0px; backface-visibility: hidden;'

export enum PERF_TIME {
  LOAD = 'load',
  BOOTSTRAP = 'bootstrap',
}
