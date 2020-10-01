import KoaRouter from '@koa/router'
import KoaBody from 'koa-body'

let router = new KoaRouter()

router
  .post('/:callback_token', KoaBody(), (ctx) => {
    if (ctx.params.callback_token !== ctx.bot.callback_hash) {
      ctx.body = null
      return
    }

    ctx.body = ctx.bot.update(ctx.request.body)
  })

export default router