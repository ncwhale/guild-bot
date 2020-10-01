import fetch from 'node-fetch'

class Bot {
  constructor(config) {
    this.token = config.token
    this.callback_url = `${config.prefix}${config.token}`
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