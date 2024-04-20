/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { parseSync, traverse } from '@babel/core'
import type { SourceLocation } from '@babel/types'
import type { IText } from 'html5parser'
import { parse, walk } from 'html5parser'
import MagicString from 'magic-string'
import { desctructVars, isCdn, isRelativeReferences } from './utils'
import { DANGER_IDENTIFIERS, EXCLUDE_TAG } from './common'
import { Logger } from './log'

export class Compiler {
  warnings: { info: string; loc: SourceLocation }[] = []
  logger = new Logger()
  unUsedVars = new Set<string>()
  constructor(public fakeGlobalVar: string, public nativeVars: string[], public customVars: string[], public isDebug: boolean) {

  }

  get configTag() {
    return `<merak c='${encodeURIComponent(JSON.stringify({
      _n: this.nativeVars,
      _c: this.customVars,
      _f: this.fakeGlobalVar,
    }))}'></merak>`
  }

  get internalScript() {
    return `const ${this.fakeGlobalVar}=window.${this.fakeGlobalVar}||window;${this.customVars.length > 0 ? `${this.fakeGlobalVar}.__m_p__=(k)=>new Proxy(()=>{},{get(_, p) {const v= ${this.fakeGlobalVar}[k][p];return typeof v==='function'?v.bind(${this.fakeGlobalVar}):v},has(target, p) { return p in ${this.fakeGlobalVar}[k]}, set(_,p,v){${this.fakeGlobalVar}[k][p]=v;return true },apply(_,t,a){return ${this.fakeGlobalVar}[k](...a) }})` : ''}`
  }

  get variables() {
    return [...this.nativeVars, ...this.customVars]
  }

  get initAllVarString() {
    return `const {${desctructVars(this.nativeVars)}}=${this.fakeGlobalVar};${this.customVars.map(item => `const ${item}=${this.fakeGlobalVar}.__m_p__('${item}')`).reduce((p, c) => `${p + c};`, '')}`
  }

  getImportLocFromScript(script: string) {
    const ast = parseSync(script) as any
    const locs = [] as [number, number][]
    traverse(ast, {

      ImportDeclaration(path) {
        const { node } = path

        const { value, start, end } = node.source as any
        if (isRelativeReferences(value))
          locs.push([start, end])
      },
      // dynamic import
      Import(path) {
        const { value, start, end } = (path.parent as any).arguments[0]
        if (isRelativeReferences(value))
          locs.push([start, end])
      },

    })
    return locs
  }

  compileScript(code: string, file: string, force?: boolean) {
    const nativeSet = new Set<string>()
    const s = new MagicString(code)
    const warning: { info: string; loc: SourceLocation }[] = []

    let start = 0
    let end = 0
    if (force) {
      s.appendLeft(start, `(()=>{${this.initAllVarString}`)
      s.append('})()')
    }
    else {
      const ast = parseSync(code, { filename: 'any' }) as any

      traverse(ast, {
        ReferencedIdentifier: (path) => {
          const { start, loc, name } = path.node as any
          if (!path.scope.hasBinding(name, true)) {
            if (!this.variables.includes(name))
              this.logger.collectUnscopedVar(file, name)
            if (DANGER_IDENTIFIERS.includes(path.node.name))
              this.logger.collectDangerUsed(file, `"${name}" is danger,need to be wrapped in $sandbox`, loc)

            if (this.nativeVars.includes(name)) {
              if (s.slice(start! - 13, start!) === EXCLUDE_TAG) {
                s.overwrite(start, start + name.length, `(window.isMerak?window.rawWindow.${name}:${name})`)
                nativeSet.add('window')

                return
              }

              nativeSet.add(name)
            }
            if (this.customVars.includes(name))

              s.appendLeft(start, `${this.fakeGlobalVar}.`)
          }
        },
        Program(path) {
          start = path.node.start as number
          end = path.node.end as number
        },
      })
      const injectGlobals = [...nativeSet]

      if (injectGlobals.length) {
        s.appendLeft(start, `(()=>{const {${desctructVars(injectGlobals)}}=${this.fakeGlobalVar};`)
        s.appendRight(end, '})()')
      }
    }

    return { code: s.toString(), map: s.generateMap({ hires: true }), warning }
  }

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
            if (!this.variables.includes(name))
              this.logger.collectUnscopedVar(file, name)
            if (DANGER_IDENTIFIERS.includes(path.node.name))
              this.logger.collectDangerUsed(file, `"${name}" is danger,need to be wrapped in $sandbox`, [loc!.start.line, loc!.start.column])

            if (this.nativeVars.includes(name)) {
              if (start && s.slice(start! - 13, start!) === EXCLUDE_TAG) {
                s.overwrite(start, start + name.length, `(window.isMerak?window.rawWindow.${name}:${name})`)
                nativeSet.add('window')
                return
              }

              nativeSet.add(name)
            }

            if (this.customVars.includes(name))
              s.appendLeft(start!, `${this.fakeGlobalVar}.`)
          }
        },

      })

      const injectGlobals = [...nativeSet]
      // globals = injectGlobals
      if (injectGlobals.length)
        s.appendRight(0, `\nconst {${desctructVars(injectGlobals)}}=${this.fakeGlobalVar};`)
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
          s.appendRight(start, `${this.fakeGlobalVar}.`)
        }
      },
    })

    return { code: s.toString(), map: s.generateMap({ hires: true }) }
  }

  compileHTML(html: string, file: string) {
    const s = new MagicString(html)
    s.replace('</head>', `<head><script merak-ignore>${this.internalScript}</script>`)
    const ast = parse(html)
    const locs = [] as [number, number][]

    walk(ast, {
      enter: (node) => {
        if (node.type === 'Tag') {
          if (node.name === 'script') {
            const outScriptNode = node.attributes.some(item => item.name.value === 'src')

            if (node.attributes.some(item => item.name.value === 'merak-ignore'))
              return

            // recording external script node to replace them in browser
            if (outScriptNode) {
              const { start, end, value } = node.attributes.find(item => item.name.value === 'src')?.value!
              if (!isCdn(value)) {
                this.logger.collectAction(file, `replace script src "${value}"`)
                locs.push([start + 1, end - 1])
              }
              // ret._s.push({ _f: merakSrc || value, _tl: [start, end], _a: merakAttrs, _t: 'outline' })
            }
            else {
              const { start } = node.close as IText
              const { end } = node.open

              const source = html.slice(end, start)

              this.getImportLocFromScript(source).forEach(item => locs.push([end + item[0] + 1, end + item[1] - 1]))
            }
          }

          // recording link node to replace publicpath in browser(useless in pure mode)

          if (node.name === 'link' && node.attributes.some(item => item.name.value === 'href')) {
            const outLinkNode = node.attributes.find(item => item.name.value === 'href')
            const { value: { start, end, value } } = outLinkNode as any
            if (!isCdn(value)) {
              this.logger.collectAction(file, `replace link href "${value}"`)

              locs.push([start + 1, end - 1])
            }
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
    s.replace('</body>', `${this.configTag}</body>`)

    return { code: s.toString(), map: s.generateMap({ hires: true }) }
  }

  output(outputPath?: string) {
    this.logger.output(outputPath)
  }
}
