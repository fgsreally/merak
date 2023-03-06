import { MERAK_DATA_ID, MERAK_DATA_VARNAME } from '../common'
import { getInstance } from '../composable'
import { Merak } from '../merak'
import type { CustomProxyHandler } from '../types'
import { flow, noop } from '../utils'
export const libHandler: CustomProxyHandler = (arg: any) => {
  delete arg.history
  delete arg.location
  return arg
}

export function execScript(idAndName: string, url: string, customHandler: CustomProxyHandler = noop) {
  if (!getInstance(idAndName)) {
  // eslint-disable-next-line @typescript-eslint/indent, no-new
  new Merak(idAndName, url, { customHandler: flow(libHandler, customHandler) })
    const el = document.createElement('merak-block')
    el.setAttribute(MERAK_DATA_ID, idAndName)
    el.setAttribute(MERAK_DATA_VARNAME, idAndName)
    document.body.appendChild(el)
  }

  return import(url)
}
