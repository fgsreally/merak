import type { Options } from 'tsup'

export const tsup: Options = process.env.PROD
  ? {
      entry: ['src/index.ts'],
      format: ['iife', 'esm'],
      globalName: 'Merak',
      define: {
        'process.env.NODE_ENV': '"production"',
      },
      minify: true,
      outDir: 'dist/prod',

    }
  : process.env.DEV
    ? {
        entry: ['src/index.ts'],
        format: ['iife', 'esm'],
        globalName: 'Merak',
        define: {
          'process.env.NODE_ENV': '"development"',
        },
        minify: true,
        outDir: 'dist/dev',

      }
    : {
        entry: ['src/index.ts'],
        format: ['esm', 'cjs'],

        dts: true,
        splitting: false,
        clean: true,
        shims: false,
        sourcemap: !process.env.CI,
      }
