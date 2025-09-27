import { useContext } from 'react';
import { DBTContext } from '../context/DBTContext';

export const useDBTStatus = () => {
  const context = useContext(DBTContext);
  if (!context) {
    throw new Error('useDBTStatus must be used within a DBTProvider');
  }
  return context;
};