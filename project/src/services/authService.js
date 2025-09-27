import { apiService } from './api';

export const authService = {
  async login(email, password) {
    // For demo purposes, simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@dbt.gov.in' && password === 'admin123') {
          resolve({
            user: { id: 1, email, name: 'Admin User', role: 'admin' },
            token: 'mock-admin-token'
          });
        } else if (password === 'password') {
          resolve({
            user: { id: 2, email, name: 'Regular User', role: 'user' },
            token: 'mock-user-token'
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  },

  async signup(userData) {
    // For demo purposes, simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: { ...userData, id: Date.now(), role: 'user' },
          token: 'mock-user-token'
        });
      }, 1000);
    });
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