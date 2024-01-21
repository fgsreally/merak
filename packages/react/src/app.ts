import type { Loader } from 'merak-core'
import { $$jump, CompileLoader, MERAK_DATA_ID, MERAK_FLAG, Merak, SSRLoader, getInstance } from 'merak-core'
import { createElement, useEffect } from 'react'
import type { shareProps } from './types'
export const reactLoader = new CompileLoader()
export const reactSSRLoader = new SSRLoader()

export const hooks = [
  'beforeMount',
  'afterMount',
  'beforeUnmount',
  'afterUnmount',
  'load',
  'transformScript',
  'tranformDocument',
  'deactive',
] as const

export function MerakApp(
  props: shareProps & {
    loaderOptions?: any
    loader?: Loader
    route?: string
    ssr?: boolean
  } & Partial<Merak['lifeCycle']>) {
  const { url, proxy, loader, loaderOptions, props: MerakProps, iframe, name, route, timeout, inlineStyle = true, flag = 'destroy', ssr = false } = props

  const app = getInstance(name) || new Merak(name, url, { loader: loader || (ssr ? reactSSRLoader : reactLoader), loaderOptions, proxy, iframe, timeout })
  if (MerakProps)
    app.props = MerakProps
  useEffect(() => {
    const originHooks = {} as Record<string, any>
    for (const hook of hooks) {
      if (props[hook]) {
        const origin = app.lifeCycle[hook]
        originHooks[hook] = origin
        app.lifeCycle[hook] = (arg: any) => {
          origin?.(arg)
          props[hook]!(arg)
        }
      }
    }

    return () => {
      if (inlineStyle)
        app.storeCSSLink()

      Promise.resolve().then(() => {
        for (const hook of hooks) {
          if (props[hook])
            app.lifeCycle[hook] = originHooks[hook]
        }
      })
    }
  }, [])

  useEffect(() => {
    route && $$jump(name, route)
  }, [route])

  return createElement('merak-app', { [MERAK_DATA_ID]: name, [MERAK_FLAG]: flag }, null)
}
