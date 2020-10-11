import crypto from "crypto";
import { DataTypes } from 'sequelize'
import { } from '../../utils/polyfill.js'

function define_model(sequelize) {
  sequelize.define('GuildInfo', {
    ChatID: {
      type: DataTypes.NUMBER,

    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    token: {
      type: DataTypes.STRING,
      unique: true,
      defaultValue: () => crypto.randomBytes(12).toBase64url()
    }
  }, {
    indexes: [
      {
        name: 'ChatID',
        fields: ['ChatID'],
      },
    ],
  })
}

export default define_model