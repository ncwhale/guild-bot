#!/usr/bin/env node

async function main() {
  const config = (await import('./config.mjs')).default

  config.log.debug({ config }, "config")

  const Bot = (await import('../bot/index.mjs')).default
  let bot = new Bot(config.bot)
  await bot.init_done()

  for (cmd of config._) {
    if (config.verbose)
      config.log.debug(`Process command:  ${cmd}`)

    if (cmd in bot) {
      result = await bot[cmd](config)
      config.log.info(result, `${cmd} result:`)
    } else {
      config.log.error(`${cmd} not impl in bot`)
    }
  }
}

if (require.main === module) {
  main()
}

module.exports = main