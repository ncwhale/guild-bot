import { URL } from 'url'
import crypto from 'crypto'
import fetch from 'node-fetch'
import loader from './loader.js'

class Bot {
  constructor(config) {
    this.log = config.log
    this.token = config.token

    const hash = crypto.createHash('sha256')
    hash.update(`${config.prefix}${this.token}`)
    this.callback_hash = hash.digest('hex')

    this.callback_url = `${config.prefix}${this.callback_hash}`
    this.api_url = `${config.api_prefix || 'https://api.telegram.org/bot'}${config.token}/`

    // Create apis on object.
    Bot.generate_telegram_apis(this)

    this.loader_promise = loader(config) // Promise!
      .then(result => {
        this.modules = result.Modules
        this.callbacks = result.Callbacks
      })
  }

  static generate_telegram_apis(obj) {
    const get_param_apis = [
      'getMe',
      'deleteWebhook', 'getWebhookInfo',
      'getMyCommands']

    const post_param_apis = [
      "sendMessage", "forwardMessage",
      "editMessageText", "editMessageCaption", "editMessageMedia", "editMessageReplyMarkup",
      "deleteMessage",
      "sendPhoto", "sendAudio", "sendDocument", "sendVideo", "sendAnimation", "sendVoice",
      "sendVideoNote", "sendMediaGroup",
      "sendLocation", "editMessageLiveLocation", "stopMessageLiveLocation",
      "sendVenue", "sendContact", "sendDice", "sendChatAction",
      "getUserProfilePhotos", "getFile",
      "kickChatMember", "unbanChatMember", "restrictChatMember", "promoteChatMember",
      "setChatAdministratorCustomTitle", "setChatPermissions", "exportChatInviteLink",
      "setChatPhoto", "deleteChatPhoto", "setChatTitle", "setChatDescription",
      "pinChatMessage", "unpinChatMessage",
      "leaveChat",
      "getChat", "getChatAdministrators", "getChatMembersCount", "getChatMember",
      "setChatStickerSet", "deleteChatStickerSet",
      "sendPoll", "stopPoll",
      "answerCallbackQuery", "setMyCommands",
      "sendSticker", "getStickerSet", "uploadStickerFile", "createNewStickerSet", "addStickerToSet", "setStickerPositionInSet", "deleteStickerFromSet", "setStickerSetThumb",
      "answerInlineQuery",
      "sendInvoice", "answerShippingQuery", "answerPreCheckoutQuery",
      "sendGame", "setGameScore", "getGameHighScores",
    ]

    get_param_apis.forEach(api => obj[api] = obj.get_telegram_api.bind(obj, api))
    post_param_apis.forEach(api => obj[api] = obj.post_telegram_api.bind(obj, api))
  }

  async init_done() {
    // wait for all constructor ready.
    await this.loader_promise
  }

  info() {
    return {
      loaded_moduels: Object.keys(this.modules),
      callback_hash: this.callback_hash,
      callback_url: this.callback_url,
    }
  }

  async get_telegram_api(api, param = {}) {
    const url = new URL(`${this.api_url}${api}`)
    Object.keys(param).forEach(key => url.searchParams.append(key, param[key]))

    const result = await fetch(url)

    return await result.json()
  }

  async post_telegram_api(api, param = {}) {
    const result = await fetch(`${this.api_url}${api}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(param)
    })

    return await result.json()
  }

  async SendMessage(param) {
    // TODO: param check.
    return this.sendMessage({
      chat_id: param.chat_id,
      text: param.text,
      parse_mode: param.parse_mode,
      reply_to_message_id: param.reply_to_message_id,
    })
  }

  async SetMyCommands(param) {
    param = Object.assign({
      auto_merge_commands: true,
      commands: [],
    }, param)

    if (param.auto_merge_commands) {
      for (key in this.modules) {
        if ('commands' in this.modules[key]) {
          const cmd = await this.modules[key].commands()
          param.commands = param.commands.concat(cmd)
        }
      }
    }

    return await this.setMyCommands({
      commands: param.commands
    })
  }

  async PinChatMessage(param) {
    // TODO: param check.

    return this.pinChatMessage({
      chat_id: param.chat_id,
      message_id: param.message_id,
      disable_notification: !!param.disable_notification,
    })
  }

  async SetWebhook(param) {
    return await this.setWebhook({ url: this.callback_url })
  }

  async update(ctx, update) {
    ctx.log.info({ update }, "Process update")
    // Process telegram update
    const keys = Object.keys(update)
    for (const key of keys) {
      for (const cb of this.callbacks[key]) {
        await cb(ctx, update)
      }
    }

    // TODO: Merge results
    return ctx.body = Object.assign({}, ctx.body)
  }
}

export default Bot