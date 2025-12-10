const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/database');

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

// Connect to the database
connectDB();

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
