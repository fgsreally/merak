import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { $deactive, $onMount, $onUnmount } from 'merak-helper'
import App from './root'
function setup() {
  const root = ReactDOM.createRoot(document.getElementById('root')!)
  root.render(
    <React.StrictMode>
      <BrowserRouter window={window}>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  )
  return root
}
let root: ReactDOM.Root | undefined

$onMount(() => {
  root = setup()
})

$onUnmount((flag) => {
  root?.unmount()
  if (flag === 'destroy')
    $deactive()
})
