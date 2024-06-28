import type { Merak } from '../merak'
export function createProxyTimer(instance: Merak) {
  const fakeTimeOut = (...args: Parameters<typeof setTimeout>) => {
    const timer = setTimeout(...args)
    instance.sideEffects.push(() => clearTimeout(timer))

    return timer
  }

  const fakeTimeInterval = (...args: Parameters<typeof setTimeout>) => {
    const timer = setInterval(...args)
    instance.sideEffects.push(() => clearInterval(timer))

    return timer
  }

  return {
    setTimeout: fakeTimeOut,
    setInterval: fakeTimeInterval,
  }
}
