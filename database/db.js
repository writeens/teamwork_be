const { Pool } = require('pg');

// DB connection string
const connectString = 'postgres://teamwork:teamwork@localhost/teamwork';


// Create a pool
const pool = new Pool({
  connectionString: connectString,
});

module.exports = pool;
