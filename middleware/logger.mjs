function create_logger(config) {
  let cfg = Object.assign({ verbose: 0 }, config)

  var request_id = 0;
  var log = config.log;
  if (cfg.verbose > 3) {
    log = log.child({ module: 'koa' })
  }

  return function (ctx, next) {
    let ctx_log = ctx.log = log.child({
      ReqId: ++request_id,
    });

    let start
    if (cfg.debug) {
      start = Date.now()
    }

    next()
      .then((ctx) => {
        if (cfg.debug) {
          const ms = Date.now() - start
          ctx_log.debug({ ms }, "Request Done")
        } else {
          ctx_log.debug("Request Done")
        }
      })
      .catch((err) => {
        ctx_log.error(err)
        // err.expose = true
        // throw err
      })
  }
}

export default create_logger