export const CATEGORIES = [
  'Politics',
  'Sports',
  'Technology',
  'Entertainment',
  'Business',
  'Health',
  'Education',
  'Other'
];

export const APPROVAL_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
};

export const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const validateReporterId = (reporterId) => {
  const pattern = /^[A-Za-z]+PN\d+$/;
  return pattern.test(reporterId);
};
