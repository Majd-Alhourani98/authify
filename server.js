const app = require('./app');
const connectDB = require('./config/database');

// Connect to the database
connectDB();

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
