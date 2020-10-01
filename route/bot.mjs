import KoaRouter from '@koa/router'
import KoaBody from 'koa-body'

let router = new KoaRouter()

router.get('/', (ctx, next) => {
  ctx.body = null
})
.post('/', KoaBody(), (ctx)=>{
  if(ctx.params.token != ctx.bot.callback_hash){
    ctx.body = null
    return
  }

  ctx.body = ctx.bot.update(ctx.request.body)
})

export default router