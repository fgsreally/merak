# merak-compile

## 3.0.1

### Patch Changes

- 738d1b2: Isolate globally declared variables and functions(Globally declared values need to remain referenced)

## 3.0.0

### Major Changes

- 364aa8b: refact compile system(cli/vite/webpack/esbuild);
  unified variable name in sandbox(**m_xx**);
  fix ssr method;
  rename $instance to $app
  refact logger

### Patch Changes

- 364aa8b: add compileHTML to handle js on tag in html(like <div onclick="statement">
- 364aa8b: rename analyseHtml to analysePathInHTML;rename compileHTML to resolvePathInHTML

## 2.1.3

### Patch Changes

- bba2726: fix SsrTransformer. now it can work for http stream
- bba2726: add addMerakTagToHtml for ssr basic use(for convenient)
- bba2726: SsrTransformer should have the same opts in addMerakTagToHtml

## 2.1.1

### Patch Changes

- 45d1c69: add /\*_ @merak _/ tag to exclude nativeVariable

## 2.1.0

### Patch Changes

- f0659ce: injectGlobalToESM will inject code to the first line
- f0659ce: support url in inline style and standard @import in css

## 2.0.2

### Patch Changes

- 76c8ad5: replace isInline with output/loader, update the schema
- 7856542: support url in inline style and standard @import in css
- 76c8ad5: add addEventListener to default nativeVars

## 2.0.1

### Patch Changes

- 0e96eea: cli can handle inline style
- d4a0366: fix postcss plugin, clone :root style to :host style correctly

## 2.0.0

### Patch Changes

- 43f4145: cli can handle .css files
- 43f4145: fix postcss plugin to avoid adding :host selector repeatedly

## 1.0.4

### Patch Changes

## 1.0.3

### Patch Changes

## 1.0.2

### Patch Changes

- 62efd4d: fix analyseJSGlobals
- 62efd4d: hadnle absolute/relative path correctly

## 1.0.1

### Patch Changes

- 6c567af: add baseUrl and refactor loader

## 1.0.0

### Major Changes

- 9ccc825: ready to publish

## 1.0.0-rc.0

### Major Changes

- 9ccc825: ready to publish
