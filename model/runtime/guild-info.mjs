import { DataTypes } from 'sequelize'
import {} from '../../utils/polyfill.js'

function define_model(sequelize){
  sequelize.define('GuildInfo', {
    ChatID:{
      type: DataTypes.NUMBER,
    },
    name: {
      type: DataTypes.STRING,
    },
    active: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
    token: {
      type: DataTypes.STRING,
    }
  }, {

  })
}

export default define_model