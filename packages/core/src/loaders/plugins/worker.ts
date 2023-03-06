import type { MerakPlugin } from '../../types'

export function workerPlugin(): any {
  return {
    preload: param => postMessage(param),
    load: param => postMessage(param),
    error: param => postMessage(param),
    init(loader) {
      addEventListener('message', (e) => {
        const data = e.data
        switch (data.cmd) {
          case 'load':
            loader.load(data.id, data.url, data.globalVar, data.configUrl)
            break
          case 'preload':
            loader.preload(data.id, data.filePath)
            break
          case 'destroy':
            loader.destroy()
            close()
            break
        }
      })
    },
  } as MerakPlugin<any>
}
