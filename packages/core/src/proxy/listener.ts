import { MERAK_EVENT_PREFIX } from '../common'
import { getApp } from '../helper'

export function createProxyListener(id: string) {
  // work for merak custom event
  // prefer to keep it if you don't want to make break change
  return (...params: Parameters<typeof addEventListener>) => {
    const eventName = params[0]
    const instance = getApp(id)!

    if (eventName.startsWith(MERAK_EVENT_PREFIX)) {
      params[0] = eventName + id
      if (instance.options.iframe)
        instance.sideEffects.push(() => removeEventListener(...params))
    }
    else {
      instance.sideEffects.push(() => removeEventListener(...params))
    }
    addEventListener(...params)
  }
}
