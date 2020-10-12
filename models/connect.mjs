import Sequelize from 'sequelize'
import RuntimeModels from '../model/runtime.mjs'
import LoggerModels from '../model/log.mjs'
import RediveModels from '../model/redive.mjs'

// Database for bot runtime.
async function connect_runtime_db(config) {
  const sequelize = new Sequelize(config.db.runtime, {
    logging: (...msg) => config.log.debug(msg),
  })

  RuntimeModels(sequelize)

  return sequelize
}

// Database for log records.
async function connect_log_db(config) {
  const sequelize = new Sequelize(config.db.log, {
    logging: false, // Don't log log to log.
  })

  LoggerModels(sequelize)

  return sequelize
}

// Database from [PCR API](https://redive.estertion.win/api.htm)
async function connect_pcr_db(config) { 
  const sequelize = new Sequelize(config.db.redive, {
    logging: (...msg) => config.log.debug(msg),
  })

  RediveModels(sequelize)

  return sequelize
}

export { connect_runtime_db, connect_log_db, connect_pcr_db }
export default connect_runtime_db