import { defineConfig } from 'vitest/config'

defineConfig({
  test: {
    include: ['packages/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
})
