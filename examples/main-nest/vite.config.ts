import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'merak-core/loader': 'http://localhost:3000/loaders/index.mjs',
      'merak-core': 'http://localhost:3000/index.mjs',
    },
  },
  define: {
    __DEV__: true,
  },
})