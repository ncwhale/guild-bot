// Scan the directory, load feature one by one in this order:
// 1. Path itself(for index.[m]js)
// 2. subfolder&.[m]js files order by basename in alphabet
// 3. no recursion scan in subfolders. Instead, use this module with 
//    config: { path: __dirname }

// All bot features are equal to each other:
// 1. Export a constructor function/class with config as param.
// 2. After new, return a object with binding key:function.
// 3. When message coming, every features with match function will be called in load order.
// 4. Every feature function can be async, and will wait if promise returned.
// 5. If any subprocess need return a value to TG API, use ctx.body.
//    Warning: return value may overrite each other, use Object.assign or Array.push.

const fs = require('fs').promises
const path = require('path')

// Update fields from [Getting updates](https://core.telegram.org/bots/api#getting-updates)
const UpdateMessageFields = {
  update_id: [],            // Integer,	The update's unique identifier. Update identifiers start from a certain positive number and increase sequentially. This ID becomes especially handy if you're using Webhooks, since it allows you to ignore repeated updates or to restore the correct update sequence, should they get out of order. If there are no new updates for at least a week, then identifier of the next update will be chosen randomly instead of sequentially.
  message: [],              // Message,	Optional. New incoming message of any kind — text, photo, sticker, etc.
  edited_message: [],       // Message,	Optional. New version of a message that is known to the bot and was edited
  channel_post: [],         // Message,	Optional. New incoming channel post of any kind — text, photo, sticker, etc.
  edited_channel_post: [],  // Message,	Optional. New version of a channel post that is known to the bot and was edited
  inline_query: [],         // InlineQuery,	Optional. New incoming inline query
  chosen_inline_result: [], // ChosenInlineResult,	Optional. The result of an inline query that was chosen by a user and sent to their chat partner. Please see our documentation on the feedback collecting for details on how to enable these updates for your bot.
  callback_query: [],       // CallbackQuery,	Optional. New incoming callback query
  shipping_query: [],       // ShippingQuery,	Optional. New incoming shipping query. Only for invoices with flexible price
  pre_checkout_query: [],   // PreCheckoutQuery,	Optional. New incoming pre-checkout query. Contains full information about checkout
  poll: [],                 // Poll,	Optional. New poll state. Bots receive only updates about stopped polls and polls, which are sent by the bot
  poll_answer: [],          // PollAnswer,	Optional. A user changed their answer in a non-anonymous poll. Bots receive new votes only in polls that were sent by the bot itself.
}

// Keys for function merge.
const UpdateMessageKeys = Object.keys(UpdateMessageFields)

function instance_callback_merge(callback, instance) {
  for (key of UpdateMessageKeys) {
    if (key in instance && instance[key] instanceof Function) {
      const bind_function = instance[key].bind(instance)
      callback[key].push(bind_function)
    }
  }
}

async function bot_loader(config) {
  config = Object.assign({
    path: './bot/features',
    module_ignore: ['index.js'], //Default ignore index.js
  }, config)

  const log = config.log

  // Make a clone.
  let Callbacks = Object.assign({}, UpdateMessageFields)
  const abs_path = path.join(__dirname, '..', config.path)

  log.info(`Load module from ${abs_path}`)

  // Try load the path as module.
  const m = await load_js_module(abs_path)
  if (m instanceof Function) {
    log.debug(`${abs_path} loaded as module.`)

    const instance = new m(config)
    instance_callback_merge(Callbacks, instance)
  } else {
    log.debug(`Scan ${abs_path} for modules...`)

    // If failed, scan the path for modules.
    const dir = await fs.opendir(abs_path)
    let scan_names = []
    for await (const item of dir) {
      // skip ignore modules.
      if (config.module_ignore.includes(item.name)) continue

      // Only follow path/file/symbollinks
      if (item.isFile() || item.isSymbolicLink() || item.isDirectory()) {
        scan_names.push(item.name)
      }
    }

    scan_names = scan_names.sort()
    log.debug({ scan_names }, "Load modules:")

    for (name of scan_names) {
      const extname = path.extname(name)
      const full_path = path.join(abs_path, name)
      let m = null
      switch (extname) {
        case '.mjs':
          m = await load_ejs_module(full_path)
          break;
        case '.cjs':
          m = load_cjs_module(full_path)
          break;
        case '.js':
        default:
          m = await load_js_module(full_path)
      }

      if (m instanceof Function) {
        log.debug(`${full_path} loaded as module.`)

        const instance = new m(config)
        instance_callback_merge(Callbacks, instance)
      }
    }
  }

  // log.debug({ Callbacks }, "Bot feature loaded")
  // console.log({ Callbacks }, "Bot feature loaded")

  return Callbacks
}

async function load_js_module(file) {
  // try load file as cjs first
  let feature = load_cjs_module(file)
  if (feature instanceof Function) return feature

  // if fail, try load it as ejs
  feature = await load_ejs_module(file)
  if (feature instanceof Function) return feature

  // final fail.
  return null
}

function load_cjs_module(file) {
  try {
    const feature = require(file)
    if (feature instanceof Function) return feature
  } catch (err) {
    return null
  }

  return null
}

async function load_ejs_module(file) {
  try {
    const feature = (await import(file)).default
    if (feature instanceof Function) return feature
  } catch (err) {
    return null
  }

  return null
}

module.exports = bot_loader