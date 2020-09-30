import Koa from 'koa'
import KoaJson from 'koa-json'
import { router } from './route/index.mjs'
import fs from 'fs'
import process from 'process'
import config from "./config.js"

function is_listen_path() {
  return (typeof config.path === 'string' || config.path instanceof String)
}

// Remove socket file if exists.
function remove_socket_file() {
  if (is_listen_path()) {
    if (fs.existsSync(config.path))
      fs.unlinkSync(config.path)
  }
}


const app = new Koa()

// JSON middleware
app.use(KoaJson(config.json || { pretty: false, param: "p" }))
  .use(router.routes())
  .use(router.allowedMethods())

if (is_listen_path()) {
  process.on("exit", remove_socket_file)
  remove_socket_file()
  app.listen(config.path)
}
else
  app.listen(config.port || 3000, config.host || '127.0.0.1')