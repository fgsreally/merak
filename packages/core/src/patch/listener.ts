import { MERAK_EVENT, MERAK_EVENT_PREFIX } from '../common'

export function patchListener() {
  // work for merak custom event
  // prefer to keep it if you don't want to make break change
  return (...params: Parameters<typeof addEventListener>) => {
    const eventName = params[0]

    if (eventName.startsWith(MERAK_EVENT_PREFIX)) {
      params[0] = eventName + id
    }
    else {
      addEventListener(MERAK_EVENT.DESTROY + id, () => {
        removeEventListener(...params)
      }, { once: true })
    }
    addEventListener(...params)
  }
}
