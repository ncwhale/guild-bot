class GuildBattlePin {
  constructor(config){
    this.regex = config.auto_pin_regex || /[\s^](?:[Bb][12345]|[一二三四五壹貳叄肆伍]王|挂树)[了\s$]/
  }

  message(ctx, update){
    if ('text' in update.message
    && !update.message.from.is_bot
    && this.regex.test(update.message.text)){
      return ctx.bot.pinChatMessage({
        chat_id: update.message.chat.id,
        message_id: update.message.message_id,
        disable_notification: true,
      })
    }
  }
}

export default GuildBattlePin