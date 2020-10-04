// This is an example of simple bot function.
// Regex for verify 'hi/hey/hello'
const hello_regex = /(?:^|\W)[Hh](?:i|ey|ello)(?:\W|$)/
const hello_reply = [
  "Hello",
  "Hey",
  "Hi",
  "H"
]

class Hello {
  constructor(config) {
  }

  static random_hello() {
    return hello_reply[Math.floor(Math.random() * hello_reply.length)]
  }

  message(ctx, update) {
    if (hello_regex.test(update.message.text)) {

      // Do a replay to this message.
      return ctx.bot.sendMessage({
        chat_id: update.message.chat.id,
        text: `${random_hello()}, @${update.message.from.id}`
      })
    }
  }
}

export default Hello