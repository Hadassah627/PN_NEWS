const mongoose = require('mongoose');

const reporterSchema = new mongoose.Schema({
  reporterId: {
    type: String,
    required: true,
    unique: true,
    match: /^[A-Za-z]+PN\d+$/  // Pattern: {PlaceName}PN{Number}
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  placeName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    default: 'reporter',
    enum: ['reporter']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Reporter', reporterSchema);
