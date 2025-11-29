const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
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
  videoUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  duration: {
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Video', videoSchema);
