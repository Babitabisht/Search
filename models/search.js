const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema

const SearchSchema = new Schema({
  searchItem: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('search', SearchSchema);
