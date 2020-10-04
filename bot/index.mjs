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

    this.callback_promise = loader(config) // Promise!
  }

  async init_done() {
    // wait for all constructor ready.
    this.callback = await this.callback_promise
  }

  info() {
    return {
      // token: this.token,
      // api: this.api_url,
      callback_hash: this.callback_hash,
      callback_url: this.callback_url,
    }
  }

  async getMe() {
    const result = await fetch(`${this.api_url}getMe`)

    return await result.json()
  }

  async sendMessage(param) {
    // TODO: param check.

    const result = await fetch(`${this.api_url}sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: param.chat_id,
        text: param.text,
        reply_to_message_id: param.reply_to_message_id,
      }),
    })

    return await result.json()
  }

  async pinChatMessage(param) {
    // TODO: param check.

    const result = await fetch(`${this.api_url}pinChatMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: param.chat_id,
        message_id: param.message_id,
        disable_notification: !!param.disable_notification,
      }),
    })

    return await result.json()
  }

  async setWebhook() {
    const result = await fetch(`${this.api_url}setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: this.callback_url }),
    })

    return await result.json()
  }

  async deleteWebhook() {
    const result = await fetch(`${this.api_url}deleteWebhook`)

    return await result.json()
  }

  async getWebhookInfo() {
    const result = await fetch(`${this.api_url}getWebhookInfo`)

    return await result.json()
  }

  async update(ctx, update) {
    ctx.log.trace({updpate}, "Process update")
    // Process telegram update
    const keys = Object.keys(update)
    for (const key of keys) {
      for (const cb of this.callback[key]) {
        await cb(ctx, update)
      }
    }

    // TODO: Merge results
    return ctx.body = Object.assign({}, ctx.body)
  }
}

export default Bot