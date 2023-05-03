import type { Options } from 'tsup'

export const tsup: Options = process.env.PROD
  ? {
      entry: ['src/index.ts'],
      format: ['iife', 'esm'],
      globalName: 'Merak',
      define: {
        __DEV__: 'false',
      },
      outDir: 'dist/prod',

    }
  : {
      entry: ['src/index.ts', 'src/loaders/index.ts'],
      format: ['esm', 'cjs'],
      dts: true,
      splitting: false,
      clean: true,
      shims: false,
      sourcemap: !process.env.CI,
    }
