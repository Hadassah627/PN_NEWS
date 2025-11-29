const mongoose = require('mongoose');

const trendingNewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Politics', 'Sports', 'Technology', 'Entertainment', 'Business', 'Health', 'Education', 'Other']
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  uploadedBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'uploadedBy.userType',
      required: true
    },
    userType: {
      type: String,
      required: true,
      enum: ['Admin', 'Reporter']
    },
    name: String,
    reporterId: String
  },
  approvalStatus: {
    type: String,
    default: 'Approved',
    enum: ['Pending', 'Approved', 'Rejected']
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  trendingScore: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TrendingNews', trendingNewsSchema);
