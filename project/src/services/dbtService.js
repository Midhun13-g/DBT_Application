import { apiService } from './api';
import { DBT_STATUS } from '../utils/constants';

export const dbtService = {
  async checkStatus(aadhaarDigits, applicationId) {
    // For demo purposes, simulate API call with mock logic
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock status generation based on last digit of Aadhaar
        const lastDigit = parseInt(aadhaarDigits.slice(-1));
        let status;
        
        if (lastDigit >= 7) {
          status = DBT_STATUS.ENABLED;
        } else if (lastDigit >= 4) {
          status = DBT_STATUS.LINKED_NOT_ENABLED;
        } else {
          status = DBT_STATUS.NOT_LINKED;
        }

        resolve({
          aadhaarDigits,
          applicationId,
          status,
          checkedAt: new Date().toISOString(),
          bankDetails: {
            bankName: 'State Bank of India',
            accountNumber: `****${Math.random().toString().slice(-4)}`,
            ifscCode: 'SBIN0001234'
          }
        });
      }, 2000);
    });
  },

  async bulkStatusCheck(csvData) {
    // Process CSV data and return bulk status results
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = csvData.map((row, index) => ({
          ...row,
          status: index % 3 === 0 ? DBT_STATUS.ENABLED : 
                 index % 3 === 1 ? DBT_STATUS.LINKED_NOT_ENABLED : 
                 DBT_STATUS.NOT_LINKED,
          checkedAt: new Date().toISOString()
        }));
        resolve(results);
      }, 3000);
    });
  },

  async getStatusHistory(userId) {
    // Get user's status check history
    return apiService.get(`/dbt/history/${userId}`);
  },

  async updateStatus(aadhaarDigits, newStatus) {
    // Admin function to update DBT status
    return apiService.put('/dbt/update-status', {
      aadhaarDigits,
      newStatus
    });
  }
};