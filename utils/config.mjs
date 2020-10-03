import argv from './argv.js'
import logger from './logger.mjs'

let config = Object.assign({
  verbose: 2,     //Default level: error
  slient: false,  //Default: not slient.
  debug: false    //Default: not debug
}, argv)

config.log = logger(config)

export default config