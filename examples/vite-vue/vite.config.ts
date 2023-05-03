import { URL, fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { Merak, merakPostCss } from 'vite-plugin-merak'

export default defineConfig({
  plugins: [vue(), Merak('vite_vue', [], {})],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    sourcemap: true,
  },
  server: {
    port: 4004,
  },
  css: {
    postcss: {
      plugins: [merakPostCss()],
    },
  },
})
