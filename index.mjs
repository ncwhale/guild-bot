import Koa from 'koa'
import KoaJson from 'koa-json'
import KoaLogger from './middleware/logger.mjs'
import router from './route/index.mjs'
import Bot from './bot/index.mjs'
import fs from 'fs'
import process from 'process'
import config from "./utils/config.mjs"

const log = config.log
log.info(config, "App init")

function is_listen_path() {
  return (typeof config.service.path === 'string' || config.service.path instanceof String)
}

// Wait for import.meta.main show in node.
function is_entrypoint() {
  if ('main' in import.meta) {
    return import.meta.main
  }

  return true;
}

// Remove socket file if exists.
function remove_socket_file() {
  if (is_listen_path()) {
    if (fs.existsSync(config.service.path))
      fs.unlinkSync(config.service.path)
  }
}

const app = new Koa()
app.silent = true // Disable console.errors, use pino instead.

app.context.bot = new Bot(config.bot)

// logger middleware
app.use(KoaLogger(config))

// Koa middleware
app.use(KoaJson(config.json || { pretty: false, param: "p" }))
  .use(router.routes())
  .use(router.allowedMethods())

async function main() {
  await app.context.bot.init_done()

  if (is_listen_path()) {
    process.on("exit", remove_socket_file)
    remove_socket_file()
    app.listen(config.service.path)
  }
  else
    app.listen(config.port || 3000, config.host || '127.0.0.1')
}

if (is_entrypoint()) {
  main()
}

export default app