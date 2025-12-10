const mongoose = require('mongoose');
const buildDatabaseURI = require('../utils/buildDatabaseURI');

const DB_URI = 'mongodb://localhost:27017/';

// const { DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME, DATABASE_URL } = process.env;
// const DB_URI = buildDatabaseURI(DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME, DATABASE_URL);

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
