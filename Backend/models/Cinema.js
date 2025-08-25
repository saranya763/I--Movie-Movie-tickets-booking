const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  }
});

const cinemaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  distance: {
    type: String
  },
  facilities: [{
    type: String
  }],
  screens: [screenSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Cinema', cinemaSchema);
