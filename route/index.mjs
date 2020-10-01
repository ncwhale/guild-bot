import KoaRouter from '@koa/router'
import Bot from './bot.mjs'

let router = new KoaRouter()

router
  .use('/bot/:token', Bot.routes(), Bot.allowedMethods())
  .all('/(.*)', (ctx, next) => {
    ctx.body = null
  })

export default router