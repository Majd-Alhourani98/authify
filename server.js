process.on('uncaughtException', err => {
  console.error('🔥🔥 Uncaught Exception:', err.name, err.message);
  process.exit(1);
});

const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connectDB = require('./config/database');

// Connect to the database
connectDB();

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION — shutting down...', reason);

  server.close(() => {
    process.exit();
  });
});
