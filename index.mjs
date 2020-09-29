import config from "./config.js";
import Koa from 'koa';

console.log(config)

const app = new Koa()

app.listen(config.listen)