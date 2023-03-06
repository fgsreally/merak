export function patchTimer() {
  const timeOutStack: NodeJS.Timeout[] = []
  const timeNoopStack: NodeJS.Timer[] = []
  const fakeTimeOut = (...args: Parameters<typeof setTimeout>) => {
    const timer = setTimeout(...args)
    timeOutStack.push(timer)
  }

  const fakeTimeInterval = (...args: Parameters<typeof setTimeout>) => {
    const timer = setInterval(...args)
    timeNoopStack.push(timer)
  }

  return {
    globals: {
      setTimeout: fakeTimeOut,
      setInterval: fakeTimeInterval,
    },
    free: () => {
      timeOutStack.forEach(item => clearTimeout(item))
      timeNoopStack.forEach(item => clearInterval(item))
    },
  }
}
