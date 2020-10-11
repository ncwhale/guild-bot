import GuildInfo from './runtime/guild-info.mjs'
import GuildPlayer from './runtime/guild-player.mjs'
import GuildBattle from './runtime/guild-battle.mjs'

function define_model(sequelize){
  GuildInfo(sequelize)
  GuildPlayer(sequelize)
  GuildBattle(sequelize)
}

export default define_model