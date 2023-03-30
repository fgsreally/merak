#!/usr/bin/env zx
import { execa } from 'execa'
import waitOn from 'wait-on'
import killPort from 'kill-port'
import config from './config.js'
import { step } from './utils.js'
const ports = config.map(item => item.port)

const opts = {
  resources: ports.map(port => `http-get://localhost:${port}`),
  log: true,
  // vite project need to accept headers
  headers: {
    accept: '*/*',
  },
  validateStatus(status) {
    return status >= 200 && status < 300 // default if not provided
  },
}

export async function runAllExample() {
  console.time('runAllExample')

  try {
    if (process.env.CI) {
      step('\n clear ports...')
      await Promise.all(ports.map(port => killPort(port)))

      step('\n building dev project...')
      await execa('pnpm run build:example')

      step('\n http-server dev dist...')
      config.forEach(({ name, port }) => {
        execa(`pnpm --filter ${name} exec -- http-server ./dist --cors -p ${port}`)
      })

      await waitOn(opts)
    }
    else {
      step('\n clear ports...')
      await Promise.all(ports.map(port => killPort(port)))

      step('\n building package...')
      await execa ('pnpm run build')

      step('\n run dev project...')
      execa('pnpm run dev:example')

      step('\n wait project start...')
      await waitOn(opts)

      step('\n start e2e test...')
    }
  }
  catch (err) {
    ports.forEach(port => killPort(port))
    throw err
  }
  console.timeEnd('runAllExample')
}
