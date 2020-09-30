import KoaRouter from '@koa/router'

let router = new KoaRouter()

router.get('/', (ctx, next) => {
  ctx.body = {
    hello: "world"
  }
})

export { router }