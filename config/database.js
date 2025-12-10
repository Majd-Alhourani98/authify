const mongoose = require('mongoose');

// const DB_URI = 'mongodb://localhost:27017/';
const DB_URI = process.env.DATABASE_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
