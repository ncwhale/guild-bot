const config = require('./argv')

async function main() {
  if (config.verbose)
    console.log("config: ", config)

  const Bot = (await import('../bot/index.mjs')).default
  let bot = new Bot(config.bot)

  for (cmd of config._) {
    if (config.verbose)
      console.log("Process command:", cmd)

    if (cmd in bot) {
      result = await bot[cmd](config)
      console.log(result)
    }else{
      console.error(`${cmd} not impl in bot`)
    }
  }
}

if (require.main === module) {
  main()
}

module.exports = config