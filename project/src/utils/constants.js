// Application constants
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const DBT_STATUS = {
  ENABLED: 'enabled',
  LINKED_NOT_ENABLED: 'linked_not_enabled',
  NOT_LINKED: 'not_linked'
};

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

export const LANGUAGES = {
  en: 'English',
  hi: 'हिंदी',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  kn: 'ಕನ್ನಡ',
  ml: 'മലയാളം',
  bn: 'বাংলা',
  gu: 'ગુજરાતી',
  mr: 'मराठी'
};

export const CAMP_LOCATIONS = [
  'Delhi Central Office',
  'Mumbai Regional Center',
  'Bangalore Tech Hub',
  'Chennai Service Center',
  'Kolkata Branch',
  'Hyderabad Office',
  'Pune Center',
  'Ahmedabad Branch'
];

export const TIME_SLOTS = [
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM'
];

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED'
};

export const ADMIN_PERMISSIONS = {
  VIEW_USERS: 'view_users',
  EDIT_USERS: 'edit_users',
  DELETE_USERS: 'delete_users',
  MANAGE_CAMPS: 'manage_camps',
  VIEW_ANALYTICS: 'view_analytics'
};