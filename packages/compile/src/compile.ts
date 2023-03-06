/**
 * this file was working for dynamic mode,to inject globalVars in browser
 * but now, merak perfers to inject globalVars by compiling, the file is  useless
 * I plan to provide an new dynamic mode in future,
 * so keep the file
 */
import { extname, join, relative, resolve } from 'path'
import fs from 'fs-extra'
import {
  analyseHTML,
  analyseJS,
  injectGlobalToESM,
  injectGlobalToIIFE,
} from './analyse'

import { isCdn } from './utils'
import type { ImportScript, MerakConfig, MerakJSFile, MerakOptions, SpaMerakConfig } from './types'
// const fileSet = new Set()

/**
 * @deprecated
 */
export async function compileSsrProject(inputOptions: any, root: string) {
  const allInfo = {}
  for (const filePath of inputOptions.files) {
    const jsInfo = { files: [], lazyFiles: {} } as SpaMerakConfig
    await compileJS(inputOptions, jsInfo, root, filePath, new Set())

    allInfo[filePath] = jsInfo
    for (const fileInfo of jsInfo.files) {
      for (const dynamicPath in (fileInfo as MerakJSFile).dynamicImports) {
        const dynamicConfig = jsInfo.lazyFiles[dynamicPath] = { files: [], lazyFiles: [] }
        await compileLazyJS(inputOptions, dynamicConfig, jsInfo, root, dynamicPath, new Set())
      }
    }
  }
  return allInfo
}

export async function compileSpaProject(inputOptions: MerakOptions, root: string) {
  const projectInfo = { files: [], lazyFiles: {} } as SpaMerakConfig

  const htmlPath = resolve(root, 'index.html')
  const str = await fs.promises.readFile(htmlPath, 'utf-8')
  const htmlInfo = analyseHTML(str)

  for (const importInfo of htmlInfo.scripts) {
    if ((importInfo as ImportScript).filePath)
      await compileJS(inputOptions, projectInfo, root, (importInfo as ImportScript).filePath, new Set())
  }

  for (const fileInfo of projectInfo.files) {
    for (const dynamicPath in (fileInfo as MerakJSFile).dynamicImports) {
      const dynamicConfig = projectInfo.lazyFiles[dynamicPath] = { files: [], lazyFiles: [] } as any
      await compileLazyJS(inputOptions, dynamicConfig, projectInfo, root, dynamicPath, new Set())
    }
  }
  projectInfo.files.push(htmlInfo)

  return projectInfo
}

/**
 * @deprecated
 */
export async function compileJS(inputOptions: MerakOptions, config: SpaMerakConfig, root: string, path: string, fileSet: Set<string>) {
  if (config.files.some(item => item.type === 'js' && item.filePath === path))
    return

  if (isCdn(path)) {
    // TODO CDN PATH
  }
  else {
    const jsPath = resolve(root, path)
    if (fileSet.has(jsPath))
      return
    fileSet.add(jsPath)
    const code = await fs.promises.readFile(jsPath, 'utf-8')
    const jsInfo = analyseJS(code, jsPath, root, inputOptions.globals)

    for (const importInfo of jsInfo.imports)

      await compileJS(inputOptions, config, root, importInfo.filePath, fileSet)

    config.files.push(jsInfo)
  }
}

export async function compileLazyJS(inputOptions: MerakOptions, config: {
  files: MerakJSFile[]
  lazyFiles: string[]
}, entryInfo: SpaMerakConfig, root: string, path: string, fileSet: Set<string>) {
  if (config.files.some(item => item.type === 'js' && item.filePath === path))
    return
  if (isCdn(path)) {
    //
  }
  else {
    const jsPath = resolve(root, path)
    if (fileSet.has(jsPath))
      return
    fileSet.add(jsPath)

    const code = await fs.promises.readFile(jsPath, 'utf-8')
    const jsInfo = analyseJS(code, jsPath, root, inputOptions.globals)

    for (const importInfo of jsInfo.imports)
      await compileLazyJS(inputOptions, config, entryInfo, root, importInfo.filePath, fileSet)

    for (const dynamicPath in jsInfo.dynamicImports) {
      const dynamicConfig = entryInfo.lazyFiles[dynamicPath] = { files: [], lazyFiles: [] }
      config.lazyFiles.push(dynamicPath)
      await compileLazyJS(inputOptions, dynamicConfig, entryInfo, root, dynamicPath, fileSet)
    }
    config.files.push(jsInfo)
  }
}
/**
 * @deprecated
 */
export async function compileESMProject(inputOptions: MerakOptions, dir: string, to: string, globalVar: string) {
  const htmlRet = {} as unknown as MerakConfig
  walkSync(dir, (filePath) => {
    if (extname(filePath) === '.js') {
      fs.outputFile(resolve(to, relative(dir, filePath)), injectGlobalToESM(fs.readFileSync(filePath, 'utf-8'), globalVar, inputOptions.globals).code, 'utf-8')
      return
    }
    if (extname(filePath) === '.html')
      htmlRet.template = analyseHTML(fs.readFileSync(filePath, 'utf-8'))

    fs.copySync(filePath, resolve(to, relative(dir, filePath)))
  })
}
/**
 * @deprecated
 */
export async function compileIIFEProject(inputOptions: MerakOptions, dir: string, to: string, globalVar: string) {
  const htmlRet = {} as unknown as MerakConfig
  walkSync(dir, async (filePath) => {
    if (extname(filePath) === '.js') {
      await fs.outputFile(resolve(to, relative(dir, filePath)), injectGlobalToIIFE(fs.readFileSync(filePath, 'utf-8'), globalVar, inputOptions.globals).code, 'utf-8')
      return
    }
    if (extname(filePath) === '.html')
      htmlRet.template = analyseHTML(fs.readFileSync(filePath, 'utf-8'))

    await fs.copy(filePath, resolve(to, relative(dir, filePath)))
  })
  return htmlRet
}
function walkSync(currentDirPath: string, callback: (param: string) => void) {
  fs.readdirSync(currentDirPath, { withFileTypes: true }).forEach((dirent) => {
    const filePath = join(currentDirPath, dirent.name)
    if (dirent.isFile())
      callback(filePath)

    else if (dirent.isDirectory())
      walkSync(filePath, callback)
  })
}
