const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
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
    reporterId: String  // Only for reporters
  },
  approvalStatus: {
    type: String,
    default: 'Approved',  // Admin posts are auto-approved
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

newsSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('News', newsSchema);
