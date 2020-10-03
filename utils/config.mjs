import config from './argv.js'
import logger from './logger.mjs'

config.log = logger(config)

export default config