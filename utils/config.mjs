import config from './argv.js'
import logger from './logger.mjs'

config.bot.log = config.log = logger(config)

export default config