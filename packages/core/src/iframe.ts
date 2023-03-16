import { MERAK_DATA_ID } from './common'
export class IframePool {
  pool = new Map<string, {
    count: number
    el: HTMLIFrameElement
  }>()

  add(id: string): Promise<HTMLIFrameElement> {
    if (this.pool.has(id)) {
      const obj = this.pool.get(id)!
      obj.count++
      return Promise.resolve(obj.el)
    }
    const iframeEl = document.createElement('iframe')
    iframeEl.setAttribute(MERAK_DATA_ID, id)
    document.body.appendChild(iframeEl)
    this.pool.set(id, {
      el: iframeEl,
      count: 1,
    })
    return new Promise((resolve, reject) => {
      iframeEl.onload = () => resolve(iframeEl)
      iframeEl.onerror = reject
    })
  }

  remove(id: string) {
    const obj = this.pool.get(id)!
    obj.count--
    if (obj.count === 0) {
      obj.el.remove()
      this.pool.delete(id)
      return true
    }
    return false
  }
}

export const iframeInstance = new IframePool()
