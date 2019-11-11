const { Pool } = require('pg');

// DB connection string
// const connectString = 'postgres://username:password@localhost/databasename';
// const connectString = 'postgres://teamwork:teamwork@localhost/teamwork';
const connectString = 'postgres://postgres:@localhost/teamwork';


// Create a pool
const pool = new Pool({
  connectionString: connectString,
});

module.exports = pool;
