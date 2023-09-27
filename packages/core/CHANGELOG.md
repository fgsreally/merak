# merak-core

## 2.0.0-alpha.0

### Major Changes

- 81c8105: break change: only leave mount and unmount event ,replace keep-alive with flag

### Patch Changes

- 059498e: add destroy method to destroy merak instance
- e41326f: add instance param in lifecycle

## 1.0.12

### Patch Changes

- 83fa2f1: set timeout default to 0 (it won't debounce)
- 83fa2f1: rename execHook to execCycle

## 1.0.11

### Patch Changes

- 41bb6f7: add timer to avoid repeating hooks when switching page quickly

## 1.0.10

### Patch Changes

- 381661b: replace sandDocument with sandHtml(instead createHTMLDocument with htmlElement)
- 381661b: query should sort before hash

## 1.0.9

### Patch Changes

- 66a9004: fix debug when output symbol key
- 66a9004: init props with an empty object({})
- 66a9004: will remove merak listener when using iframe
- 66a9004: add more debug

## 1.0.8

### Patch Changes

- 0527d62: fix iframe mode

## 1.0.7

### Patch Changes

- 707f509: fix debug when output symbol key

## 1.0.6

### Patch Changes

- 87ef5df: add dubplicateName Error when setting global vars

## 1.0.5

### Patch Changes

- a52fd22: compileLoader use html url (not baseUrl) when compileHtml
- a52fd22: should turn execPromise to true after all scripts loaded ,to make sure afterMount will emit once

## 1.0.4

### Patch Changes

- 1768700: compileHtml should handle baseUrl
- ff0d801: add **VUE_OPTIONS_API**
- ff0d801: remove default body style
- 748d2e5: should getInstance after instance create when using proxy

## 1.0.3

### Patch Changes

- 3fb68ce: compileHtml should handle baseUrl
- 3fb68ce: add **VUE_OPTIONS_API**
- 3fb68ce: remove default body style

## 1.0.2

### Patch Changes

- 62efd4d: compileHtml should handle baseUrl

## 1.0.1

### Patch Changes

- 6c567af: add baseUrl and refactor loader

## 1.0.0

### Major Changes

- 9ccc825: ready to publish

## 1.0.0-rc.0

### Major Changes

- 9ccc825: ready to publish

### Patch Changes

- Updated dependencies [9ccc825]
  - merak-compile@1.0.0-rc.0
