import Theme from 'vitepress/theme'
import { h } from 'vue'
import './styles/vars.css'

const inBrowser = typeof window !== 'undefined'
export default {
  ...Theme,

}
