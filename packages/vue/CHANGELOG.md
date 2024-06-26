# merak-vue

## 3.0.1

### Patch Changes

- Updated dependencies [738d1b2]
  - merak-core@3.0.1
  - merak-helper@3.0.0

## 3.0.0

### Major Changes

- 364aa8b: refact compile system(cli/vite/webpack/esbuild);
  unified variable name in sandbox(**m_xx**);
  fix ssr method;
  rename $instance to $app
  refact logger

### Patch Changes

- Updated dependencies [364aa8b]
- Updated dependencies [364aa8b]
- Updated dependencies [364aa8b]
  - merak-helper@3.0.0
  - merak-core@3.0.0

## 2.1.4

### Patch Changes

- 9be6ae8: props on MerakImport will work for both MerakInstance and remote component
- 9be6ae8: add ssr to MerakApp;remove MerakSSR
- Updated dependencies [9be6ae8]
  - merak-core@2.1.4
  - merak-helper@2.0.2

## 2.1.3

### Patch Changes

- Updated dependencies [8696dec]
  - merak-helper@2.0.2

## 2.1.2

### Patch Changes

- Updated dependencies [f5c28d2]
- Updated dependencies [f5c28d2]
  - merak-core@2.1.2
  - merak-helper@2.0.1

## 2.1.1

### Patch Changes

- Updated dependencies [4b93e18]
- Updated dependencies [45d1c69]
  - merak-helper@2.0.1
  - merak-core@2.1.1

## 2.1.0

### Minor Changes

- f0659ce: add storeCSSLink to transform link to inline style (for perf)

### Patch Changes

- f0659ce: add shareemits to block component which can trigger hook at now
- Updated dependencies [f0659ce]
- Updated dependencies [f0659ce]
- Updated dependencies [f0659ce]
- Updated dependencies [31634b3]
  - merak-core@2.1.0
  - merak-helper@2.0.0

## 2.0.2

### Patch Changes

- 76c8ad5: add deactive hook
- Updated dependencies [7856542]
  - merak-core@2.0.2
  - merak-helper@2.0.0

## 2.0.1

### Patch Changes

- Updated dependencies [7b8cb7f]
  - merak-core@2.0.1
  - merak-helper@2.0.0

## 2.0.0

### Major Changes

- 43f4145: break change: only leave mount and unmount event ,replace keep-alive with flag

### Patch Changes

- 43f4145: add loaderOptions to app/ssr, add timeout to all components
- 43f4145: add destroy method to destroy merak instance
- 43f4145: add instance param in lifecycle
- 43f4145: degrade vue version
- Updated dependencies [43f4145]
- Updated dependencies [43f4145]
- Updated dependencies [43f4145]
- Updated dependencies [43f4145]
  - merak-helper@2.0.0
  - merak-core@2.0.0

## 2.0.0-alpha.1

### Patch Changes

- Updated dependencies [70316cb]
  - merak-helper@2.0.0-alpha.1

## 2.0.0-alpha.0

### Major Changes

- 81c8105: break change: only leave mount and unmount event ,replace keep-alive with flag

### Patch Changes

- 6cfc7be: add loaderOptions to app/ssr, add timeout to all components
- 059498e: add destroy method to destroy merak instance
- e41326f: add instance param in lifecycle
- Updated dependencies [059498e]
- Updated dependencies [81c8105]
- Updated dependencies [e41326f]
  - merak-core@2.0.0-alpha.0
  - merak-helper@2.0.0-alpha.0

## 1.0.13

### Patch Changes

- 83fa2f1: add loaderOptions to app/ssr, add timeout to all components
- 664aa47: inheritAttrs should be true
- Updated dependencies [83fa2f1]
- Updated dependencies [83fa2f1]
  - merak-core@1.0.12
  - merak-helper@1.0.1

## 1.0.12

### Patch Changes

- Updated dependencies [41bb6f7]
  - merak-core@1.0.11
  - merak-helper@1.0.1

## 1.0.11

### Patch Changes

- Updated dependencies [381661b]
  - merak-core@1.0.10
  - merak-helper@1.0.1

## 1.0.10

### Patch Changes

- 66a9004: only setGlobalVars for the first time in block component
- Updated dependencies [66a9004]
  - merak-core@1.0.9
  - merak-helper@1.0.1

## 1.0.9

### Patch Changes

- 0527d62: add lifecycle in mounted hook and revert if the lifecyle is not changed
- Updated dependencies [0527d62]
  - merak-core@1.0.8
  - merak-helper@1.0.1

## 1.0.8

### Patch Changes

- Updated dependencies [707f509]
  - merak-core@1.0.7
  - merak-helper@1.0.1

## 1.0.7

### Patch Changes

- 87ef5df: only setGlobalVars for the first time in block component
- Updated dependencies [87ef5df]
  - merak-core@1.0.6
  - merak-helper@1.0.1

## 1.0.6

### Patch Changes

- a52fd22: replace onBeforeUnmount with onUnmounted ,make sure that resume lifecycle after unmount lifecycle emit
- Updated dependencies [a52fd22]
  - merak-core@1.0.5
  - merak-helper@1.0.1

## 1.0.5

### Patch Changes

- 31ba561: vue component will overwrite lifecycle at now

## 1.0.4

### Patch Changes

- 748d2e5: add head to block component
- Updated dependencies [1768700]
- Updated dependencies [ff0d801]
- Updated dependencies [748d2e5]
  - merak-core@1.0.4
  - merak-helper@1.0.1

## 1.0.3

### Patch Changes

- Updated dependencies [3fb68ce]
  - merak-core@1.0.3
  - merak-helper@1.0.1

## 1.0.2

### Patch Changes

- Updated dependencies [62efd4d]
  - merak-core@1.0.2
  - merak-helper@1.0.1

## 1.0.1

### Patch Changes

- 6c567af: add baseUrl and refactor loader
- Updated dependencies [6c567af]
  - merak-helper@1.0.1
  - merak-core@1.0.1

## 1.0.0

### Major Changes

- 9ccc825: ready to publish

### Patch Changes

- Updated dependencies [9ccc825]
  - merak-core@1.0.0
  - merak-helper@1.0.0

## 1.0.0-rc.0

### Major Changes

- 9ccc825: ready to publish

### Patch Changes

- Updated dependencies [9ccc825]
  - merak-core@1.0.0-rc.0
