import KoaRouter from '@koa/router'
import Bot from './bot.mjs'

let router = new KoaRouter()

router
  .use('/bot', Bot.routes(), Bot.allowedMethods())
  .all('/', (ctx, next) => {
    ctx.body = ''
    ctx.state = 204
  })

export default router