import KoaRouter from '@koa/router'
import KoaBody from 'koa-body'

let router = new KoaRouter()

router
  .post('/:callback_token', KoaBody(), (ctx) => {
    if (ctx.params.callback_token !== ctx.bot.callback_hash) {
      ctx.log.error({ params: ctx.params, body: ctx.request.body }, "Callback token not match")
      ctx.throw(405)
      return
    }

    ctx.body = ctx.bot.update(ctx, ctx.request.body)
  })

export default router