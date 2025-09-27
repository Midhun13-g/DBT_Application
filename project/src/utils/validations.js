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
  return password.length >= 8;
};

export const validateName = (name) => {
  return name.trim().length >= 2;
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
    errors.password = 'Password must be at least 8 characters long';
  }
  
  if (formData.name && !validateName(formData.name)) {
    errors.name = 'Name must be at least 2 characters long';
  }
  
  return errors;
};