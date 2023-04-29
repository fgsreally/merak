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
      step('\n building sub project...')
      await $`pnpm --filter example-sub-* run build`

      step('\n serve bundle...')
      $`pnpm run example:serve`

      step('\n main project running ...')
      $`pnpm --filter example-main-* --parallel run dev`

      await waitOn(opts)
      step('\n start e2e test...')
    }
    else {
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
