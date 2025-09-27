// Helper utility functions
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const validateAadhaar = (aadhaarDigits) => {
  return /^\d{4}$/.test(aadhaarDigits);
};

export const validateApplicationId = (appId) => {
  return /^[A-Z0-9]{8,12}$/.test(appId);
};

export const maskAccountNumber = (accountNumber) => {
  if (!accountNumber || accountNumber.length < 4) return accountNumber;
  return '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
};

export const generateBookingId = () => {
  return 'BOOK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};