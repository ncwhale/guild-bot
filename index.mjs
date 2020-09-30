import Koa from 'koa';
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


if (is_listen_path()) {
  process.on("exit", remove_socket_file)
  remove_socket_file()
  app.listen(config.path)
}
else
  app.listen(config.port || 3000, config.host || '127.0.0.1')