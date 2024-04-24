import { $location, getApp } from 'merak-helper'
import { createElement, useEffect } from 'react'
import { MERAK_DATA_ID, MERAK_FLAG, Merak } from 'merak-core'
import type { Root } from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import type { shareProps } from './types'
import { hooks } from './app'

const shareNativeVars = ['document', 'window', 'self', 'globalThis', 'setTimeout', 'setInterval']

export function MerakScope(
  props:
  shareProps & {
    url?: string
    deactive?: boolean
    head?: string
    nativeVars: string[]
    customVars: string[]
    children: any
    projectGlobalVar: string
  } & Partial<Merak['lifeCycle']>) {
  const { url = $location().origin, head, proxy, deactive = true, props: MerakProps, iframe, name, timeout, inlineStyle = true, children, flag = 'destroy', projectGlobalVar, nativeVars = shareNativeVars, customVars = [] } = props
  const app = getApp(name) || new Merak(name, url, { proxy, iframe, timeout })

  if (!app.projectGlobalVar)
    app.setGlobalVars(projectGlobalVar, nativeVars, customVars)
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
    const container = document.createElement('div')
    let root: Root
    app.load().then(() => {
      if (head)
        app.sandHtml!.querySelector('head')!.innerHTML = head

      app.sandHtml!.querySelector('body')!.append(container)
      root = createRoot(container)
      root.render(children)
    })

    return () => {
      // https://stackoverflow.com/questions/73459382/react-18-async-way-to-unmount-root
      setTimeout(() => {
        root.unmount()
      })
      deactive && app.deactive()
    }
  }, [])

  return createElement('merak-app', { [MERAK_DATA_ID]: name, [MERAK_FLAG]: flag })
}

export function MerakImport(
  props:
  shareProps & {
    source: string
    url?: string
    deactive?: boolean
    head?: string
    nativeVars: string[]
    customVars: string[]
    projectGlobalVar: string
  } & Partial<Merak['lifeCycle']>) {
  const { url = $location().origin, head, proxy, deactive = true, props: MerakProps, iframe, name, timeout, inlineStyle = true, flag = 'destroy', projectGlobalVar, nativeVars = shareNativeVars, customVars = [], source } = props
  const app = getApp(name) || new Merak(name, url, { proxy, iframe, timeout })
  if (!app.projectGlobalVar)
    app.setGlobalVars(projectGlobalVar, nativeVars, customVars)
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
    const container = document.createElement('div')
    let root: Root
    app.load().then(async () => {
      const { default: Comp } = await import(/* @vite-ignore */source)
      if (head)
        app.sandHtml!.querySelector('head')!.innerHTML = head

      app.sandHtml!.querySelector('body')!.append(container)
      root = createRoot(container)
      root.render(createElement(Comp, MerakProps))
    })

    return () => {
      setTimeout(() => {
        root.unmount()
      })
      deactive && app.deactive()
    }
  }, [])

  return createElement('merak-app', { [MERAK_DATA_ID]: name, [MERAK_FLAG]: flag })
}
