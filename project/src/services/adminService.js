import { apiService } from './api';

class AdminService {
  // Dashboard Statistics
  async getDashboardStats() {
    try {
      return await apiService.get('/admin/dashboard/stats');
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // Return mock data as fallback
      return {
        totalUsers: 125430,
        dbtEnabled: 98765,
        pendingRequests: 15234,
        campBookings: 3456,
        monthlyBookings: 456
      };
    }
  }

  // User Management
  async getUsers(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      return await apiService.get(`/admin/users?${queryParams}`);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  }

  async updateUserStatus(userId, status) {
    try {
      return await apiService.put(`/admin/users/${userId}/status?status=${status}`);
    } catch (error) {
      console.error('Failed to update user status:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      return await apiService.delete(`/admin/users/${userId}`);
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  }

  // Camp Management
  async getCampBookings(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      return await apiService.get(`/admin/bookings?${queryParams}`);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      throw error;
    }
  }

  async updateBookingStatus(bookingId, status) {
    try {
      return await apiService.put(`/admin/bookings/${bookingId}/status?status=${status}`);
    } catch (error) {
      console.error('Failed to update booking status:', error);
      throw error;
    }
  }

  async createCamp(campData) {
    try {
      return await apiService.post('/admin/camps', campData);
    } catch (error) {
      console.error('Failed to create camp:', error);
      throw error;
    }
  }

  // Bulk Operations
  async bulkUploadUsers(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      return await apiService.request('/admin/users/bulk-upload', {
        method: 'POST',
        body: formData,
        headers: {} // Remove Content-Type to let browser set it with boundary
      });
    } catch (error) {
      console.error('Failed to bulk upload users:', error);
      throw error;
    }
  }

  async exportUsers(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await apiService.request(`/admin/users/export?${queryParams}`, {
        method: 'GET'
      });
      
      // Handle blob response for file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users_export.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to export users:', error);
      throw error;
    }
  }

  // Analytics
  async getAnalyticsData() {
    try {
      return await apiService.get('/admin/analytics');
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Return mock data as fallback
      return {
        statusDistribution: [
          { name: 'Enabled', value: 65, color: '#10B981' },
          { name: 'Linked Not Enabled', value: 25, color: '#F59E0B' },
          { name: 'Not Linked', value: 10, color: '#EF4444' }
        ],
        monthlyTrends: [
          { month: 'Jan', enabled: 1200, linked: 800, notLinked: 400 },
          { month: 'Feb', enabled: 1400, linked: 900, notLinked: 350 },
          { month: 'Mar', enabled: 1600, linked: 1000, notLinked: 300 },
          { month: 'Apr', enabled: 1800, linked: 1100, notLinked: 250 },
          { month: 'May', enabled: 2000, linked: 1200, notLinked: 200 },
          { month: 'Jun', enabled: 2200, linked: 1300, notLinked: 180 }
        ]
      };
    }
  }
}

export const adminService = new AdminService();