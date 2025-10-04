// API service layer
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class ApiService {
  constructor() {
    this.allowedHosts = ['localhost:8080', '127.0.0.1:8080'];
  }

  validateEndpoint(endpoint) {
    if (!endpoint || typeof endpoint !== 'string') {
      throw new Error('Invalid endpoint');
    }
    if (endpoint.includes('..') || endpoint.includes('//')) {
      throw new Error('Invalid endpoint path');
    }
    return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  }

  sanitizeData(data) {
    if (typeof data === 'string') {
      return data.replace(/[<>"'&]/g, '');
    }
    if (typeof data === 'object' && data !== null) {
      const sanitized = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeData(value);
      }
      return sanitized;
    }
    return data;
  }

  async request(endpoint, options = {}) {
    const validEndpoint = this.validateEndpoint(endpoint);
    const url = `${API_BASE_URL}${validEndpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error.message);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, data) {
    const sanitizedData = this.sanitizeData(data);
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(sanitizedData),
    });
  }

  put(endpoint, data) {
    const sanitizedData = this.sanitizeData(data);
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(sanitizedData),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

const api = new ApiService();
export default api;
export const apiService = api;