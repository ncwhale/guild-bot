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
    if ('text' in update.message && hello_regex.test(update.message.text) && !update.message.from.is_bot) {
      // Do a replay to this message.
      return ctx.bot.sendMessage({
        chat_id: update.message.chat.id,
        text: `${Hello.random_hello()}, @${update.message.from.username}`,
        reply_to_message_id: update.message.message_id,
      }).then((result) => {
        ctx.log.debug({ result })
      })
    }
  }
}

export default Hello