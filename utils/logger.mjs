import pino from 'pino'

function create_logger(config) {
  let pino_config = Object.assign({}, config.log)

  if (config.verbose) {
    switch (config.verbose) {
      case 5:
        pino_config.level = 'debug'
        break;
      case 4:
        pino_config.level = 'info'
        break;
      case 3:
        pino_config.level = 'warn'
        break;
      case 2:
        pino_config.level = 'error'
        break;
      case 1:
        pino_config.level = 'fatal'
        break;
      case 0:
        pino_config.level = 'slient'
        break;
      default:
        // Almost everything.
        pino_config.level = 'trace'
    }
  }

  if (config.debug) {
    pino_config.level = 'debug'
  }

  if (config.slient) {
    pino_config.level = 'silent'
  }

  return pino(pino_config)
}

export default create_logger