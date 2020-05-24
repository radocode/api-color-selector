'use strict';

// API boilerplate
const express = require('express');
const app = express();
const routes = require('./routes');

// Logging
const morgan = require('morgan');
const logger = require('./logger');

// Config
const config = require('config');

// Set up middleware for request parsing, logging, etc.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('short', { stream: logger.stream }));

// Load up the routes
app.use('/', routes);

// Start the API
app.listen(config.apiPort);
logger.log('info', `api running on port ${config.apiPort}`);

//CORS Middleware
app.use(function(req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
  next();
});

process.on('SIGTERM', () => {
  app.close(() => {
    console.log('Process terminated')
  })
})

// Export API server for testing
module.exports = app;
