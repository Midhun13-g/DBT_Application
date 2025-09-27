import React, { createContext, useContext, useState } from 'react';
import { DBT_STATUS } from '../utils/constants';

const DBTContext = createContext();

export const useDBT = () => {
  const context = useContext(DBTContext);
  if (!context) {
    throw new Error('useDBT must be used within a DBTProvider');
  }
  return context;
};

export const DBTProvider = ({ children }) => {
  const [statusHistory, setStatusHistory] = useState([]);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkDBTStatus = async (aadhaarDigits, applicationId) => {
    setLoading(true);
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock status generation based on input
      const mockStatus = generateMockStatus(aadhaarDigits, applicationId);
      
      const statusRecord = {
        id: Date.now(),
        aadhaarDigits,
        applicationId,
        status: mockStatus,
        checkedAt: new Date(),
        message: getStatusMessage(mockStatus)
      };
      
      setCurrentStatus(statusRecord);
      setStatusHistory(prev => [statusRecord, ...prev.slice(0, 4)]); // Keep last 5 records
      
      return statusRecord;
    } catch (error) {
      throw new Error('Failed to check DBT status');
    } finally {
      setLoading(false);
    }
  };

  const generateMockStatus = (aadhaarDigits, applicationId) => {
    // Simple logic to generate different statuses for demo
    const lastDigit = parseInt(aadhaarDigits.slice(-1));
    if (lastDigit >= 7) return DBT_STATUS.ENABLED;
    if (lastDigit >= 4) return DBT_STATUS.LINKED_NOT_ENABLED;
    return DBT_STATUS.NOT_LINKED;
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case DBT_STATUS.ENABLED:
        return 'Your account is DBT enabled. Benefits will be transferred directly.';
      case DBT_STATUS.LINKED_NOT_ENABLED:
        return 'Your account is linked but DBT is not enabled. Please follow the seeding guide.';
      case DBT_STATUS.NOT_LINKED:
        return 'Your account is not linked. Please follow the seeding guide to link your account.';
      default:
        return 'Status unknown.';
    }
  };

  const value = {
    statusHistory,
    currentStatus,
    loading,
    checkDBTStatus
  };

  return (
    <DBTContext.Provider value={value}>
      {children}
    </DBTContext.Provider>
  );
};

export { DBTContext }