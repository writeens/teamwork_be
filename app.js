// Import Express
const express = require('express');

// Import Body Parser
const bodyParser = require('body-parser');

// Import Item Routes
const contentRoutes = require('./routes/content');

// Create Instance of Express
const app = express();

// App to relax CORS errors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Set bodyParser's JSON function as global middleware
app.use(bodyParser.json());

// Create item routes
app.use('/api/v1', contentRoutes);

module.exports = app;
