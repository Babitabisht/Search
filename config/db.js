const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.mongoURI, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
    console.log('Mongodb connected !');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
