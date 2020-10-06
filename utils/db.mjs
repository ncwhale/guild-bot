import Sequelize from 'sequelize'

// Database for bot runtime.
async function connect_runtime_db(config) { }

// Database for log records.
async function connect_record_db(config) { }

// Database from [PCR API](https://redive.estertion.win/api.htm)
async function connect_pcr_db(config) { }

export { connect_runtime_db, connect_record_db, connect_pcr_db }
export default connect_runtime_db