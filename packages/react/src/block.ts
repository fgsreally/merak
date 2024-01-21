import { render, unmountComponentAtNode } from 'react-dom'
import { $location, getInstance } from 'merak-helper'
import { createElement, useEffect } from 'react'
import { MERAK_DATA_ID, MERAK_FLAG, Merak } from 'merak-core'
import type { shareProps } from './types'
import { hooks } from './app'
export function MerakScope(
  props:
  shareProps & {
    url?: string
    deactive?: boolean
    head?: string
    nativeVars: string[]
    customVars: string[]
    children: any
    fakeGlobalVar: string
  } & Partial<Merak['lifeCycle']>) {
  const { url = $location().origin, head, proxy, deactive, props: MerakProps, iframe, name, timeout, inlineStyle = true, children, flag = 'destroy' } = props
  const app = getInstance(name) || new Merak(name, url, { proxy, iframe, timeout })
  if (MerakProps)
    app.props = MerakProps
  useEffect(() => {
    const originHooks = {} as Record<string, any>
    for (const hook of hooks) {
      if (props[hook]) {
        const origin = app.lifeCycle[hook]
        originHooks[hook] = origin
        app.lifeCycle[hook] = (arg: any) => {
          origin(arg)
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
    let body: HTMLElement

    app.load().then(() => {
      if (head)
        app.sandHtml!.querySelector('head')!.innerHTML = head

      body = app.sandHtml!.querySelector('body')!

      render(children, body)
    })

    return () => {
      body && unmountComponentAtNode(body)
      deactive && app.deactive()
    }
  }, [])

  return createElement('merak-app', { [MERAK_DATA_ID]: name, [MERAK_FLAG]: flag })
}
