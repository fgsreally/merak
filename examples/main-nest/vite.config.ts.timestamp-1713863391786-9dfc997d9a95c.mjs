// vite.config.ts
import { URL, fileURLToPath } from "node:url";
import { defineConfig } from "file:///D:/MyProject/2024/1/merak/node_modules/.pnpm/vite@4.4.7_@types+node@18.17.1/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/MyProject/2024/1/merak/node_modules/.pnpm/@vitejs+plugin-vue@4.2.3_vite@4.4.7_vue@3.3.4/node_modules/@vitejs/plugin-vue/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///D:/MyProject/2024/1/merak/examples/main-nest/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)),
      "merak-core": process.env.PROD ? "http://127.0.0.1:3000/prod/index.mjs" : "http://127.0.0.1:3000/dev/index.mjs"
    }
  },
  server: {
    port: 5001
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxNeVByb2plY3RcXFxcMjAyNFxcXFwxXFxcXG1lcmFrXFxcXGV4YW1wbGVzXFxcXG1haW4tbmVzdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcTXlQcm9qZWN0XFxcXDIwMjRcXFxcMVxcXFxtZXJha1xcXFxleGFtcGxlc1xcXFxtYWluLW5lc3RcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L015UHJvamVjdC8yMDI0LzEvbWVyYWsvZXhhbXBsZXMvbWFpbi1uZXN0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgVVJMLCBmaWxlVVJMVG9QYXRoIH0gZnJvbSAnbm9kZTp1cmwnXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbdnVlKCldLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxyXG4gICAgICAnbWVyYWstY29yZSc6IHByb2Nlc3MuZW52LlBST0QgPyAnaHR0cDovLzEyNy4wLjAuMTozMDAwL3Byb2QvaW5kZXgubWpzJyA6ICdodHRwOi8vMTI3LjAuMC4xOjMwMDAvZGV2L2luZGV4Lm1qcycsXHJcblxyXG4gICAgfSxcclxuICB9LFxyXG5cclxuICBzZXJ2ZXI6IHtcclxuICAgIHBvcnQ6IDUwMDEsXHJcbiAgfSxcclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvVSxTQUFTLEtBQUsscUJBQXFCO0FBQ3ZXLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUY2TCxJQUFNLDJDQUEyQztBQUs5UCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsSUFBSSxDQUFDO0FBQUEsRUFDZixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLE1BQ3BELGNBQWMsUUFBUSxJQUFJLE9BQU8seUNBQXlDO0FBQUEsSUFFNUU7QUFBQSxFQUNGO0FBQUEsRUFFQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
