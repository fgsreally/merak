#!/usr/bin/env zx
import { $ } from 'zx'
import waitOn from 'wait-on'
import killPort from 'kill-port'
import config from './config.js'
import { step } from './utils.js'
const ports = config.map(item => item.port)
// main app
ports.push(5000, 5002, 5003, 5004, 3000)

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
    if (process.env.CI || process.env.PROD) {
      step('\n building  project...')
      await $`pnpm --filter merak-core run build:prod`

      await $`pnpm --filter example-* run build`

      step('\n serve bundle...')
      $`pnpm run example:serve`

      await waitOn(opts)
      step('\n start e2e test...')
    }
    else {
      await $`pnpm --filter merak-core run build:dev`

      step('\n run dev project...')
      $`pnpm run example:dev`

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

runAllExample()
