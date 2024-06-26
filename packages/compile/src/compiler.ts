import { parseSync, traverse } from /* merak */'@babel/core'
import type { SourceLocation } from '@babel/types'
import type { IText } from 'html5parser'
import { parse, walk } from 'html5parser'
import MagicString from 'magic-string'
import postcss from 'postcss'
import { desctructVars } from './utils'
import { EXCLUDE_TAG } from './common'
import { LOG_LELVEL, logger } from './log'
import { merakPostCss } from './postcss'
import { getPathLocFromHTML } from './analyse'

export class Compiler {
  warnings: { info: string; loc: SourceLocation }[] = []
  logger = logger
  unUsedVars = new Set<string>()
  constructor(public projectGlobalVar: string, public nativeVars: string[], public customVars: string[]) {

  }

  get internalScript() {
    return `const ${this.projectGlobalVar}=window.${this.projectGlobalVar}||window;${this.customVars.length > 0 ? `${this.projectGlobalVar}.__m_p__=(k)=>new Proxy(()=>{},{get(_, p) {const v= ${this.projectGlobalVar}[k][p];return typeof v==='function'?v.bind(${this.projectGlobalVar}):v},has(target, p) { return p in ${this.projectGlobalVar}[k]}, set(_,p,v){${this.projectGlobalVar}[k][p]=v;return true },apply(_,t,a){return ${this.projectGlobalVar}[k](...a) }})` : ''}`
  }

  get variables() {
    return [...this.nativeVars, ...this.customVars]
  }

  get initAllVarString() {
    const nativeVarsStr = this.nativeVars.length ? `const {${desctructVars(this.nativeVars)}}=${this.projectGlobalVar};` : ''
    const customVarsStr = this.customVars.length ? `${this.customVars.map(item => `const ${item}=${this.projectGlobalVar}.__m_p__('${item}')`).reduce((p, c) => `${p};${c}`)}` : ''
    return nativeVarsStr + customVarsStr
  }

  createTag(config: any) {
    return `<merak c='${encodeURIComponent(JSON.stringify({
      n: this.nativeVars,
      c: this.customVars,
      p: this.projectGlobalVar,
      ...config,
    }))}'></merak>`
  }

  /**
   *
   * @param force deprecate
   */
  compileScript(code: string, file: string, force?: boolean) {
    const nativeSet = new Set<string>()
    const s = new MagicString(code)

    let start = 0
    let end = 0
    if (force) {
      s.appendLeft(start, `(()=>{${this.initAllVarString}`)
      s.append('})()')
    }
    else {
      const ast = parseSync(code, { filename: 'any' }) as any
      traverse(ast, {
        FunctionDeclaration: (path) => {
          if (path.parent.type !== 'Program')
            return
          const { end, name } = path.node.id || {}

          if (end && name)
            s.appendRight(end!, `${this.projectGlobalVar}.${name}=${name}`)
        },

        // Globally declared values need to remain referenced
        VariableDeclaration: (path) => {
          if (path.parent.type !== 'Program')
            return
          const { end } = path.node

          let globalVarDeclareStr = ''
          path.node.declarations.forEach((declaration) => {
            if (!declaration.init)
              return
            const { type, name } = declaration.id as any
            if (type === 'Identifier')
              globalVarDeclareStr += `${this.projectGlobalVar}.${name}=${name};`
          })

          globalVarDeclareStr && s.appendRight(end!, `\n${globalVarDeclareStr}`)
        },
        ReferencedIdentifier: (path) => {
          const { start, loc, name } = path.node

          if (!path.scope.hasBinding(name, true)) {
            // for debug
            if (!this.variables.includes(name))
              this.logger.add(`unused variabel "${name}"`, file, LOG_LELVEL.INFO)
            if (path.node.name === 'eval')
              this.logger.add(`"eval" is danger,need to be wrapped in $sandbox :${loc!.start.line}:${loc!.start.column}`, file, LOG_LELVEL.WARN)
            if (path.node.name === 'Function' && path.parent.type === 'NewExpression')
              this.logger.add(`"new Function" is danger,need to be wrapped in $sandbox :${loc!.start.line}:${loc!.start.column}`, file, LOG_LELVEL.WARN)

            if (this.nativeVars.includes(name)) {
              if (s.slice(start! - 13, start!) === EXCLUDE_TAG) {
                s.overwrite(start!, start! + name.length, `(window.isMerak?window.rawWindow.${name}:${name})`)
                nativeSet.add('window')

                return
              }

              nativeSet.add(name)
            }
            if (this.customVars.includes(name))
              s.appendLeft(start!, `${this.projectGlobalVar}.`)
          }
        },
        Program(path) {
          start = path.node.start as number
          end = path.node.end as number
        },
      })
      const injectGlobals = [...nativeSet]

      if (injectGlobals.length) {
        s.appendLeft(start, `(()=>{const {${desctructVars(injectGlobals)}}=${this.projectGlobalVar};`)
        s.appendRight(end, '})()')
      }
    }

    return { code: s.toString(), map: s.generateMap({ hires: true }) }
  }

  /**
   *
   * @param force deprecate
   */
  compileESM(code: string, file: string, force?: boolean) {
    const nativeSet = new Set<string>()

    const s = new MagicString(code)

    if (force) {
      s.prepend(this.initAllVarString)
    }
    else {
      const ast = parseSync(code) as any
      // let lastImport
      traverse(ast, {

        ReferencedIdentifier: (path) => {
          const { name, loc, start } = path.node
          if (!path.scope.hasBinding(name, true)) {
            // for debug
            if (!this.variables.includes(name))
              this.logger.add(`unused variabel "${name}"`, file, LOG_LELVEL.INFO)
            if (path.node.name === 'eval')
              this.logger.add(`"eval" is danger,need to be wrapped in $sandbox :${loc!.start.line}:${loc!.start.column}`, file, LOG_LELVEL.WARN)
            if (path.node.name === 'Function' && path.parent.type === 'NewExpression')
              this.logger.add(`"new Function" is danger,need to be wrapped in $sandbox :${loc!.start.line}:${loc!.start.column}`, file, LOG_LELVEL.WARN)

            if (this.nativeVars.includes(name)) {
              if (start && s.slice(start! - 13, start!) === EXCLUDE_TAG) {
                s.overwrite(start, start + name.length, `(window.isMerak?window.rawWindow.${name}:${name})`)
                nativeSet.add('window')
                return
              }

              nativeSet.add(name)
            }

            if (this.customVars.includes(name))
              s.appendLeft(start!, `${this.projectGlobalVar}.`)
          }
        },

      })

      const injectGlobals = [...nativeSet]
      // globals = injectGlobals
      if (injectGlobals.length)
        s.appendRight(0, `\nconst {${desctructVars(injectGlobals)}}=${this.projectGlobalVar};`)
    }
    return { code: s.toString(), map: s.generateMap({ hires: true }) }
  }

  compileStatement(code: string) {
    const s = new MagicString(code)
    const ast = parseSync(code, { filename: 'any' }) as any
    traverse(ast, {
      ReferencedIdentifier: (path) => {
        const name = path.node.name
        if (!path.scope.hasBinding(name, true)) {
          const { start } = path.node as { start: number }
          s.appendRight(start, `${this.projectGlobalVar}.`)
        }
      },
    })

    return { code: s.toString(), map: s.generateMap({ hires: true }) }
  }

  compileStyle(style: string, file: string) {
    const { css, map } = postcss([merakPostCss()]).process(style, { from: file })
    return { code: css, map }
  }

  compileHTML(html: string, file: string) {
    const s = new MagicString(html)
    s.replace('</title>', `</title><script merak-ignore>${this.internalScript}</script>`)
    const ast = parse(html)

    walk(ast, {
      enter: (node) => {
        if (node.type === 'Tag') {
          if (node.name === 'script') {
            const outScriptNode = node.attributes.some(item => item.name.value === 'src')
            const isModule = node.attributes.some(item => item.name.value === 'type' && item.value?.value === 'module')
            if (node.attributes.some(item => item.name.value === 'merak-ignore'))
              return

            // recording external script node to replace them in browser
            if (!outScriptNode) {
              const { start } = node.close as IText
              const { end } = node.open
              const source = html.slice(end, start)

              const { code } = isModule ? this.compileESM(source, file) : this.compileScript(source, file)

              s.overwrite(end, start, code)
            }
          }

          if (node.name === 'style') {
            const { start } = node.close as IText
            const { end } = node.open
            const source = html.slice(end, start)
            const { code } = this.compileStyle(source, file)
            s.overwrite(end, start, code)
          }

          if (node.attributeMap) {
            Object.values(node.attributeMap).forEach(({ name, value }) => {
              if (name.value.startsWith('on') && value)

                s.overwrite(value.start, value.end, this.compileStatement(value.value).code)
            })
          }
        }
      },
    })

    const loc = getPathLocFromHTML(s.toString())

    s.replace('</body>', `${this.createTag({ l: loc })}</body>`)

    return { code: s.toString(), map: s.generateMap({ hires: true }) }
  }

  output(outputPath: string) {
    this.logger.output(outputPath)
  }
}
