import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: {
    __DEV__: false,
  },
  test: {
    environment: 'jsdom', // or 'jsdom', 'node'
    include: ['packages/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
})
