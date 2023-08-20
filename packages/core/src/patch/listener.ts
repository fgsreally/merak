import { MERAK_EVENT, MERAK_EVENT_PREFIX } from '../common'
import { getInstance } from '../helper'

export function patchListener(id: string) {
  // work for merak custom event
  // prefer to keep it if you don't want to make break change
  return (...params: Parameters<typeof addEventListener>) => {
    const eventName = params[0]
    const instance = getInstance(id)!

    if (eventName.startsWith(MERAK_EVENT_PREFIX)) {
      params[0] = eventName + id
      if (instance.options.iframe) {
        addEventListener(MERAK_EVENT.DESTROY + id, () => {
          removeEventListener(...params)
        }, { once: true })
      }
    }
    else {
      addEventListener(MERAK_EVENT.DESTROY + id, () => {
        removeEventListener(...params)
      }, { once: true })
    }
    addEventListener(...params)
  }
}
