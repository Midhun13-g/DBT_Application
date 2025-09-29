import { useState, useEffect } from 'react';

export const useRealTimeUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      const mockUpdates = [
        'New user registered',
        'DBT status updated for user',
        'Camp booking confirmed',
        'System backup completed',
        'New notification received'
      ];
      
      const randomUpdate = mockUpdates[Math.floor(Math.random() * mockUpdates.length)];
      const newUpdate = {
        id: Date.now(),
        message: randomUpdate,
        timestamp: new Date(),
        type: 'info'
      };
      
      setUpdates(prev => [newUpdate, ...prev.slice(0, 9)]); // Keep last 10 updates
    }, 10000); // Update every 10 seconds

    setIsConnected(true);

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, []);

  return { updates, isConnected };
};

export default useRealTimeUpdates;