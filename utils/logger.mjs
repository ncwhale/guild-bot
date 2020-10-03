import pino from 'pino'

function create_logger(config) {
  let log_config = Object.assign({}, config.log)

  if (config.debug) {
    log_config.level = 'debug'
  }
  
  if (config.verbose) {
    switch (config.verbose) {
      case 5:
        log_config.level = 'debug'
      case 4:
        log_config.level = 'info'
      case 3:
        log_config.level = 'warn'
      case 2:
        log_config.level = 'error'
      case 1:
        log_config.level = 'fatal'
      case 0:
        log_config.level = 'slient'
      default:
        // Almost everything.
        log_config.level = 'trace'
    }
  // } else {
  //   log_config.level = 'silent'
  }

  return pino(log_config)
}

export default create_logger