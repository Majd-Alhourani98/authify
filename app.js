const express = require('express');
const morgan = require('morgan');

const authRouter = require('./routes/auth.routes');

// Express application
const app = express();

// Parse incoming JSON requests
app.use(express.json());

// Use Morgan middleware to log HTTP requests
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Health Check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    message: 'Express server is running 🚀',
  });
});

app.use('/api/v1/auth', authRouter);

module.exports = app;
