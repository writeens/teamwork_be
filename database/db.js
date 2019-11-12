const { Pool } = require('pg');
const heroku = require('heroku');
const dotenv = require('dotenv');

// Dot Env Config
dotenv.config();
// console.log(process.env.NODE_ENV);
const env = process.env.NODE_ENV || 'development';
// DB connection string
// const connectString = 'postgres://username:password@localhost/databasename';
// Local
// const connectString = 'postgres://teamwork:teamwork@localhost/teamwork';
// const connectString = 'postgres://postgres:@localhost/teamwork';
// Remote
// const connectString = `${heroku config:get DATABASE_URL -a teamwork-v1}`

let connectionString = '';
if (env === 'development') {
  connectionString = 'postgres://teamwork:teamwork@localhost/teamwork';
} else {
  connectionString = 'postgres://postgres@127.0.0.1:5432/teamwork';
}
console.log(connectionString);
// console.log(connectionString);
const pool = new Pool({ connectionString });

module.exports = pool;
