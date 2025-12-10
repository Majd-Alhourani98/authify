const express = require('express');
const morgan = require('morgan');
// Express application
const app = express();

// Parse incoming JSON requests
app.use(express.json());

// Use Morgan middleware to log HTTP requests
app.use(morgan('dev'));

// Health Check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    message: 'Express server is running 🚀',
  });
});

module.exports = app;
