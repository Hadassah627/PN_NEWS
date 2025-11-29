const validateReporterId = (reporterId) => {
  // Pattern: {PlaceName}PN{Number}
  // Example: HydPN101, VizagPN202
  const reporterIdPattern = /^[A-Za-z]+PN\d+$/;
  return reporterIdPattern.test(reporterId);
};

const extractPlaceName = (reporterId) => {
  // Extract place name from reporter ID
  const match = reporterId.match(/^([A-Za-z]+)PN\d+$/);
  return match ? match[1] : null;
};

const reporterIdValidator = (req, res, next) => {
  const { reporterId } = req.body;

  if (!reporterId) {
    return res.status(400).json({ 
      message: 'Reporter ID is required.' 
    });
  }

  if (!validateReporterId(reporterId)) {
    return res.status(400).json({ 
      message: 'Invalid Reporter ID format. Use format: {PlaceName}PN{Number} (e.g., HydPN101)' 
    });
  }

  next();
};

module.exports = {
  validateReporterId,
  extractPlaceName,
  reporterIdValidator
};
