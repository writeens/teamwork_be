const { Pool } = require('pg');
const { connect } = require('./config');

const pool = new Pool({ connectionString: connect.url, ssl: connect.ssl });

module.exports = pool;
