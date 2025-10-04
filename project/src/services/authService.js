import { apiService } from './api';

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.replace(/[<>"'&]/g, '');
};

export const authService = {
  async login(email, password) {
    try {
      const sanitizedEmail = sanitizeInput(email);
      const response = await apiService.post('/auth/login', {
        email: sanitizedEmail,
        password
      });
      return response.data;
    } catch (error) {
      throw new Error('Authentication failed');
    }
  },

  async signup(userData) {
    try {
      const sanitizedData = {
        ...userData,
        email: sanitizeInput(userData.email),
        name: sanitizeInput(userData.name)
      };
      const response = await apiService.post('/auth/signup', sanitizedData);
      return response.data;
    } catch (error) {
      throw new Error('Registration failed');
    }
  },

  async logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('dbt_user');
  },

  async refreshToken() {
    // Implement token refresh logic
    return apiService.post('/auth/refresh');
  }
};