class GuildBattleProgress {
  constructor(config){
  }

  commands(){
    return [{
      command: "register",
      description: "注册成为骑空士",
    }, {
      command: "unregister",
      description: "变成古战场逃兵"
    }]
  }

  message(ctx, update){
  }
}

export default GuildBattleProgress