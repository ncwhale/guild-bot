import { DataTypes } from 'sequelize'

function define_model(sequelize) {
  sequelize.define('Log', {
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    message: {
      type: DataTypes.STRING,
    },
    level: {
      type: DataTypes.CHAR(10),
    },
    content: {
      type: DataTypes.TEXT,
    }
  }, {
    // Log timestamps comes from log itself.
    timestamps: false,
  })
}

export default define_model