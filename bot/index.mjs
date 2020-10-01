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

  async update(Update) {
    // Process telegram update
    console.log(Update)

    return {}
  }
}

export default Bot