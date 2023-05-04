import { URL, fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { merakPostCss } from 'vite-plugin-merak'
import Inspect from 'vite-plugin-inspect'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), Inspect()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'merak-core/loader': 'http://localhost:3000/prod/index.mjs',
      'merak-core': 'http://localhost:3000/prod/index.mjs',
    },
  },
  define: {
    __DEV__: true,
    // process: {
    //   env: 'development',
    // },
  },
  server: {
    port: 5004,
  },
  css: {
    postcss: {
      plugins: [merakPostCss()],
    },
  },
})
