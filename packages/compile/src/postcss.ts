import { createWarning } from './utils'

export function merakPostCss() {
  return {
    postcssPlugin: 'postcss-root-to-host',

    Root(root: any) {
      root.walkAtRules('font-face', ({ source: { start, input: { file } } }: any) => {
        createWarning('"@font-face" need manual process', file, start.line, start.column)
      })
      root.walk((node: any) => {
        if (node.selector) {
          node.selector = node.selectors
            .map((selector: any) => {
              if (/:root/g.test(selector))
                return selector.replace(/:root/g, ':root,:host')

              return selector
            })
            .join(', ')
        }
      })
    },
  }
}
