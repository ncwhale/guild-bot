import KoaRouter from '@koa/router'
import KoaBody from 'koa-body'

let router = new KoaRouter()

router.get('/', (ctx, next) => {
  ctx.body = {
    hello: "world"
  }
})
.post('/', KoaBody(), (ctx)=>{
  ctx.body = JSON.stringify(ctx.request.body)
})

export default router