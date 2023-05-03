// vite.config.ts
import { URL, fileURLToPath } from "node:url";
import { defineConfig } from "file:///D:/MyProject/4/merak/node_modules/.pnpm/vite@4.1.4_@types+node@18.14.6/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/MyProject/4/merak/node_modules/.pnpm/@vitejs+plugin-vue@4.0.0_vite@4.1.4_vue@3.2.47/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { merakPostCss } from "file:///D:/MyProject/4/merak/packages/vite-plugin-merak/dist/index.js";
import Inspect from "file:///D:/MyProject/4/merak/node_modules/.pnpm/vite-plugin-inspect@0.7.24_vite@4.1.4/node_modules/vite-plugin-inspect/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///D:/MyProject/4/merak/examples/main-vue-ssr/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [vue(), Inspect()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)),
      "merak-core/loader": "http://localhost:3000/prod/index.mjs",
      "merak-core": "http://localhost:3000/prod/index.mjs"
    }
  },
  define: {
    __DEV__: true
    // process: {
    //   env: 'development',
    // },
  },
  server: {
    port: 5004
  },
  css: {
    postcss: {
      plugins: [merakPostCss()]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxNeVByb2plY3RcXFxcNFxcXFxtZXJha1xcXFxleGFtcGxlc1xcXFxtYWluLXZ1ZS1zc3JcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXE15UHJvamVjdFxcXFw0XFxcXG1lcmFrXFxcXGV4YW1wbGVzXFxcXG1haW4tdnVlLXNzclxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovTXlQcm9qZWN0LzQvbWVyYWsvZXhhbXBsZXMvbWFpbi12dWUtc3NyL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgVVJMLCBmaWxlVVJMVG9QYXRoIH0gZnJvbSAnbm9kZTp1cmwnXG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCB7ICBtZXJha1Bvc3RDc3MgfSBmcm9tICd2aXRlLXBsdWdpbi1tZXJhaydcbmltcG9ydCBJbnNwZWN0IGZyb20gJ3ZpdGUtcGx1Z2luLWluc3BlY3QnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbdnVlKCksIEluc3BlY3QoKV0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICAnbWVyYWstY29yZS9sb2FkZXInOiAnaHR0cDovL2xvY2FsaG9zdDozMDAwL3Byb2QvaW5kZXgubWpzJyxcbiAgICAgICdtZXJhay1jb3JlJzogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9wcm9kL2luZGV4Lm1qcycsXG4gICAgfSxcbiAgfSxcbiAgZGVmaW5lOiB7XG4gICAgX19ERVZfXzogdHJ1ZSxcbiAgICAvLyBwcm9jZXNzOiB7XG4gICAgLy8gICBlbnY6ICdkZXZlbG9wbWVudCcsXG4gICAgLy8gfSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogNTAwNCxcbiAgfSxcbiAgY3NzOiB7XG4gICAgcG9zdGNzczoge1xuICAgICAgcGx1Z2luczogW21lcmFrUG9zdENzcygpXSxcbiAgICB9LFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFQsU0FBUyxLQUFLLHFCQUFxQjtBQUUvVixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsU0FBVSxvQkFBb0I7QUFDOUIsT0FBTyxhQUFhO0FBTG1MLElBQU0sMkNBQTJDO0FBUXhQLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxNQUNwRCxxQkFBcUI7QUFBQSxNQUNyQixjQUFjO0FBQUEsSUFDaEI7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixTQUFTO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFJWDtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILFNBQVM7QUFBQSxNQUNQLFNBQVMsQ0FBQyxhQUFhLENBQUM7QUFBQSxJQUMxQjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
