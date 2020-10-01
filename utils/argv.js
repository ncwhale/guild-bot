module.exports = require('yargs')
  .config('config', 'Configure file', (configPath) => {
    return require(configPath)
  })
  .default('config', './config.js', 'config.js')
  .option('verbose', {
    alias: 'v',
    describe: 'Verbose output.',
    type: 'count',
    default: false,
  })
  .command('getWebhookInfo')
  .command('deleteWebhook')
  .boolean('debug')
  // .option('bot.token', {
  //   demandOption: true,
  //   describe: "Bot token for API call",
  //   type:'string',
  // })
  .help('help')
  .alias({
    config: 'c',
    help: 'h',
  })
  .argv