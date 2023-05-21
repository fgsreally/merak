import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'merak-core': process.env.PROD ? 'http://127.0.0.1:3000/prod/index.mjs' : 'http://127.0.0.1:3000/dev/index.mjs',

    },
  },
  define: {
    __DEV__: true,
  },
  server: {
    port: 5001,
  },
})
