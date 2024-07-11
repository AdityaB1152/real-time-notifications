

const mongoose = require('mongoose');

// const mongoURI = 'mongodb://localhost:27017/star';
const mongoURI = process.env.DB_URI

const connectDb = async () => {
  try {
    await mongoose.connect(mongoURI);
    mongoose.set('strictQuery',false);
  
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDb;
