import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { Merak, merakPostCss } from 'vite-plugin-merak'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), Merak('vite_react', ['$RefreshSig$', '$RefreshReg$'], {})],
  server: {
    port: 4003,
  },
  css: {
    postcss: {
      plugins: [merakPostCss()],
    },
  },
})
