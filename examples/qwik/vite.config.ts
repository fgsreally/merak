import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { Merak, merakPostCss } from 'vite-plugin-merak'

export default defineConfig(({ mode }) => {
  return {
    plugins: [qwikCity(), qwikVite(), tsconfigPaths(), mode !== 'ssr' ? Merak('qwik', [], {}) : null],
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    },
    server:{
      port:4002,
    },
    css: {
      postcss: {
        plugins: [merakPostCss()],
      },
    },
  };
});
