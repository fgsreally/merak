import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      vue: 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.3.1/vue.esm-browser.prod.min.js',
    },
  },
  server: {
    port: 5000,
  },

  define: {
    __DEV__: true,
  },
})
