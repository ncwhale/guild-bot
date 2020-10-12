const config = require('./argv.js')

module.exports = {
  development: {
    url: config.db.runtime,
    dialect: "sqlite"
  },
}