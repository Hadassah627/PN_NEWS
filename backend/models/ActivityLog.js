const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  performedBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'performedBy.userType'
    },
    userType: {
      type: String,
      enum: ['Admin', 'Reporter', 'User']
    },
    name: String,
    email: String,
    reporterId: String
  },
  targetResource: {
    resourceType: {
      type: String,
      enum: ['News', 'TrendingNews', 'Video', 'Reporter', 'User', 'Admin']
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId
    },
    resourceTitle: String
  },
  details: {
    type: String,
    default: ''
  },
  ipAddress: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
