/* eslint-disable @typescript-eslint/ban-ts-comment */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import axios from 'axios'
import { compileHTML, resolveHtmlConfig, wrap } from 'merak-compile'
const isProduction = process.env.PROD || process.env.CI

export async function createServer(root = process.cwd(), isProd = isProduction) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const resolve = p => path.resolve(__dirname, p)
  const indexProd = isProd ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8') : ''
  const manifest = isProd ? JSON.parse(fs.readFileSync(resolve('dist/client/ssr-manifest.json'), 'utf-8')) : {}
  // @ts-expect-error

  const app = express()

  let vite
  if (!isProd) {
    vite = await (
      await import('vite')
    ).createServer({
      root,
      logLevel: 'info',
      server: {
        middlewareMode: true,
        watch: {
          usePolling: true,
          interval: 100,
        },
      },
      appType: 'custom',
    })
    // use vite's connect instance as middleware
    app.use(vite.middlewares)
  }
  else {
    // app.use((await import('compression')).default())
    app.use(
      (await import('serve-static')).default(resolve('dist/client'), {
        index: false,
      }),
    )
  }

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl

      let template, render
      if (!isProd) {
        // always read fresh template in dev
        template = fs.readFileSync(resolve('index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/entry-server')).render
      }
      else {
        template = indexProd
        render = (await import('./dist/server/entry-server.js')).render
      }

      const [strOrStream, links] = await render(url, manifest)
      const appurl = 'http://127.0.0.1:4004'
      const { data } = await axios.get(appurl)
      const { config } = resolveHtmlConfig(data)
      const html = template
        .replace('<!--preload-links-->', links)
        .replace('<!--app-html-->', strOrStream)
        .replace('</body>', `${wrap(compileHTML(data, appurl, config._l), 'http://127.0.0.1:4004')}</body>`)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    }
    catch (e) {
      vite && vite.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })

  return { app, vite }
}

createServer().then(({ app }) =>
  app.listen(5004, () => {
    console.log('http://127.0.0.1:5004')
  }),
)
