import { URL, fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { Merak, merakPostCss } from 'vite-plugin-merak'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), Merak('main_vue', [], {})],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'merak-core/loader': 'http://localhost:3000/prod/index.mjs',
      'merak-core': 'http://localhost:3000/prod/index.mjs',
    },
  },
  build: {
    rollupOptions: {
      external: ['vue', 'vue-router'],
    },
  },
  define: {
    __DEV__: true,
  },
  server: {
    port: 5003,
  },
  css: {
    postcss: {
      plugins: [merakPostCss()],
    },
  },
})
