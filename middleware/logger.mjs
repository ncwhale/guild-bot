function create_logger(config) {
  var debug = config.debug || config.verbose > 4
  var log = config.log

  if (debug) {
    // debug logger
    var request_id = 0
    log = log.child({ module: 'koa' })
    return function (ctx, next) {
      const ctx_log = ctx.log = log.child({
        ReqId: ++request_id,
      });

      // Debug path, TMI! TMI!
      const start = Date.now()
      ctx_log.debug({
        request: ctx.request
      })

      return next()
        .then(() => {
          const ms = Date.now() - start
          ctx_log.debug({
            ms,
            response: ctx.response
          }, "Request Done")
        })
        .catch((err) => {
          ctx_log.error(err)
          throw err
        })
    }
  } else if (config.slient) {
    // Just inject log item, nothing else.
    return function (ctx, next) {
      ctx.log = log
      return next()
    }
  } else {
    // Normal logger
    return function (ctx, next) {
      var request_id = 0

      const ctx_log = ctx.log = log.child({
        ReqId: ++request_id,
      });

      return next().catch((err) => {
        ctx_log.error(err)
        err.expose = true
        throw err
      })
    }
  } // Normal logger
}

export default create_logger