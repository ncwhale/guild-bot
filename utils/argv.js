module.exports = require('yargs')
  .config('config', 'Configure file', (configPath) => {
    return require(configPath)
  })
  .default('config', './config.js', 'config.js')
  .option('verbose', {
    alias: 'v',
    describe: 'Verbose output.',
    type: 'count',
    default: 2,
  })
  .option('slient', {
    alias: 'q',
    describe: 'Slient mode',
    type: 'boolean',
    default: false,
  })
  .option('debug', {
    alias: 'd',
    describe: 'Debug mode',
    type: 'boolean',
    default: false,
  })
  .option('bot.load_modules', {
    type: 'boolean',
    describe: 'Load bot modules.',
    default: true,
  })
  // .command('getWebhookInfo')
  // .command('deleteWebhook')
  // .boolean('debug')
  .option('bot.token', {
    //   demandOption: true,
    describe: "Bot token for API call",
    type: 'string',
  })
  .help('help')
  .alias({
    config: 'c',
    help: 'h',
  })
  .argv