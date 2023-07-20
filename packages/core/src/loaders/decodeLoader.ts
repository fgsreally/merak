import type { JsonLoaderOpts } from '../types'
import { JsonLoader } from './jsonLoader'

export class DecodeLoader extends JsonLoader {
  resolveHtml(html: string) {
    let config
    // <m-b> merak-base
    html = html.replace(/<m-b[^>]+config=['"](.*)['"][\s>]<\/m-b>/, (js, conf) => {
      config = JSON.parse(decodeURIComponent(conf))
      return ''
    })
    return { html, config }
  }
}
