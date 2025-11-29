const ActivityLog = require('../models/ActivityLog');

const logActivity = async (action, performedBy, targetResource = {}, details = '', ipAddress = '') => {
  try {
    const log = new ActivityLog({
      action,
      performedBy,
      targetResource,
      details,
      ipAddress
    });
    await log.save();
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

module.exports = logActivity;
