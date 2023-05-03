import type { Options } from 'tsup'

export const tsup: Options = {
  entry: ['src/index.ts', 'src/loaders/index.ts'],
  format: ['cjs', 'esm'],
  define: process.env.PROD
    ? {
        __DEV__: 'false',
      }
    : {},
  dts: true,
  splitting: false,
  clean: true,
  shims: false,
  sourcemap: !process.env.CI,
}
