import { getInstance } from '../helper'

export function createProxyTimer(id: string) {
  const fakeTimeOut = (...args: Parameters<typeof setTimeout>) => {
    const timer = setTimeout(...args)
    getInstance(id)!.sideEffects.push(() => clearTimeout(timer))

    return timer
  }

  const fakeTimeInterval = (...args: Parameters<typeof setTimeout>) => {
    const timer = setInterval(...args)
    getInstance(id)!.sideEffects.push(() => clearInterval(timer))

    return timer
  }

  return {
    setTimeout: fakeTimeOut,
    setInterval: fakeTimeInterval,
  }
}
