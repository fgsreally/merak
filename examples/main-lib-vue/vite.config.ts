import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      vue: 'http://localhost:5000/vue.js',
    },
  },
  server: {
    port: 5000,
  },

  define: {
    __DEV__: true,
  },
})
