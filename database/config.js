const dotenv = require('dotenv');

dotenv.config();
let connect = {};
const env = process.env.NODE_ENV.trim();
switch (env) {
  case 'development':
    connect = {
      url: process.env.DEV_DATABASE_URL,
      ssl: false,
    };
    break;
  case 'test':
    connect = {
      url: process.env.LOCAL_TEST,
      ssl: false,
    };
    break;
  case 'production':
    connect = {
      url: process.env.DATABASE_URL,
      ssl: true,
    };
    break;
  default:
    connect = {
      url: process.env.DEV_DATABASE_URL,
      ssl: false,
    };
}

module.exports = { connect };
