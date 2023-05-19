import { URL, fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { Merak } from 'vite-plugin-merak'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), Merak('main_vue')],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // 'merak-core/loader': 'http://127.0.0.1:3000/prod/index.mjs',
      // 'merak-core': 'http://127.0.0.1:3000/prod/index.mjs',
    },
  },
  build: {

  },
  define: {
    __DEV__: true,
  },
  server: {
    port: 5003,
  },

})
