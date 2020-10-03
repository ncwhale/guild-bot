import crypto from 'crypto'
import fetch from 'node-fetch'

class Bot {
  constructor(config) {
    this.token = config.token

    const hash = crypto.createHash('sha256')
    hash.update(`${config.prefix}${this.token}`)
    this.callback_hash = hash.digest('hex')

    this.callback_url = `${config.prefix}${this.callback_hash}`
    this.api_url = `${config.api_prefix || 'https://api.telegram.org/bot'}${config.token}/`
  }

  async getMe() {
    const result = await fetch(`${this.api_url}getMe`)

    return await result.json()
  }

  async sendMessage(param) {
    const result = await fetch(`${this.api_url}setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: param.chat_id,
        text: param.text,
      }),
    })
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

  async update(ctx, message) {
    // Process telegram update
    ctx.log.info({ message }, "Bot update")

    return {}
  }
}

export default Bot