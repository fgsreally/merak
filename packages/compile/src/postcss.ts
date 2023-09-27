import { logger } from './log'

export function merakPostCss() {
  return {
    postcssPlugin: 'postcss-root-to-host',

    Root(root: any) {
      root.walkAtRules('font-face', ({ source: { start, input: { file } } }: any) => {
        logger.collectDangerUsed(file, '"@font-face" need manual process', [start.line, start.column])
      })
      root.walk((node: any) => {
        if (node.selector) {
          if (node.selectors.includes(':root') && !node.selectors.includes(':host'))
            node.selector = node.selector.replace(':root', ':root,:host')

          // node.selector = node.selectors
          //   .map((selector: any) => {
          //     if (/:root/g.test(selector) && !/:host/g.test(selector))
          //       return selector.replace(/:root/g, ':root,:host')

          //     return selector
          //   })
          //   .join(', ')
        }
      })
    },
  }
}
