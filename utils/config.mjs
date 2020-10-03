import argv from './argv.js'
import logger from './logger.mjs'

let config = Object.assign({}, argv, {
  log: logger(argv)
})

export default config