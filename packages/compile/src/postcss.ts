import type { AcceptedPlugin } from 'postcss'
import { LOG_LELVEL, logger } from './log'

export function merakPostCss(): any {
  return <AcceptedPlugin>{
    postcssPlugin: 'postcss-merak',

    Root(root) {
      root.walkAtRules('font-face', ({ source: { start, input: { file } } }: any) => {
        logger.add(`"@font-face" need manual process:${start.line}:${start.column}`, file, LOG_LELVEL.ERROR)
      })
      root.walkAtRules('import', (rule) => {
        const { params } = rule
        if (params.startsWith('\'') || params.startsWith('"')) {
          const url = `url(${params})`
          rule.params = url
        }
      })
      // root.walkRules((rule: any) => {
      //   if (rule.selector.includes(':root')) {
      //     // 克隆当前规则并将:root替换为:host
      //     const hostRule = rule.clone()
      //     hostRule.selector = rule.selector.replace(/:root/g, ':host')

      //     // 添加新的:host规则到样式表中
      //     root.append(hostRule)
      //   }
      // })
      root.walk((node: any) => {
        if (node.selector) {
          const rootSelectors: string[] = node.selectors.filter((selector: string) => /:root/g.test(selector))
          if (rootSelectors.length) {
            for (const selector of rootSelectors) {
              const newSelector = selector.replace(':root', ':host')
              if (!node.selectors.includes(newSelector))
                node.selector += `,${newSelector}`
            }
          }
        }
      })
    },
  }
}
