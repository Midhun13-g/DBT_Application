// Form validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password) => {
  if (!password || password.length < 8) return false;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
};

export const validateName = (name) => {
  if (!name) return false;
  const sanitized = name.trim().replace(/[<>"'&]/g, '');
  return sanitized.length >= 2 && sanitized.length <= 50;
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.replace(/[<>"'&]/g, '').trim();
};

export const validateAadhaar = (aadhaar) => {
  const aadhaarRegex = /^[0-9]{4}$/;
  return aadhaarRegex.test(aadhaar);
};

export const validateApplicationId = (appId) => {
  const appIdRegex = /^[A-Za-z0-9]{6,20}$/;
  return appIdRegex.test(appId);
};

export const getValidationErrors = (formData) => {
  const errors = {};
  
  if (formData.email && !validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (formData.phone && !validatePhone(formData.phone)) {
    errors.phone = 'Please enter a valid 10-digit phone number';
  }
  
  if (formData.password && !validatePassword(formData.password)) {
    errors.password = 'Password must be at least 8 characters with uppercase, lowercase, number and special character';
  }
  
  if (formData.name && !validateName(formData.name)) {
    errors.name = 'Name must be at least 2 characters long';
  }
  
  return errors;
};