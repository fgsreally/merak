# merak-core

## 1.0.11

### Patch Changes

- 41bb6f7: replace sandDocument with sandHtml(instead createHTMLDocument with htmlElement)
- 41bb6f7: add timer to avoid repeating hooks when switching page quickly
- 41bb6f7: fix debug when output symbol key
- 41bb6f7: init props with an empty object({})
- 41bb6f7: fix iframe mode
- 41bb6f7: preload can work at now
- 41bb6f7: add dubplicateName Error when setting global vars
- 41bb6f7: Merak.load must return a promise!!
- 41bb6f7: will remove merak listener when using iframe
- 41bb6f7: add more debug
- 41bb6f7: query should sort before hash

## 1.0.10

### Patch Changes

- 381661b: replace sandDocument with sandHtml(instead createHTMLDocument with htmlElement)
- 381661b: fix debug when output symbol key
- 381661b: init props with an empty object({})
- 381661b: fix iframe mode
- 381661b: add dubplicateName Error when setting global vars
- 381661b: will remove merak listener when using iframe
- 381661b: add more debug
- 381661b: query should sort before hash

## 1.0.9

### Patch Changes

- 66a9004: fix debug when output symbol key
- 66a9004: init props with an empty object({})
- 66a9004: fix iframe mode
- 66a9004: add dubplicateName Error when setting global vars
- 66a9004: will remove merak listener when using iframe
- 66a9004: add more debug

## 1.0.8

### Patch Changes

- 0527d62: fix iframe mode
- 0527d62: add dubplicateName Error when setting global vars

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
