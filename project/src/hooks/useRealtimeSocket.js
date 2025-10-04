// DEPRECATED: Use socketService.js directly instead
import { useState, useEffect } from 'react';
import socketService from '../services/socketService';

console.warn('useRealtimeSocket hook is deprecated. Use socketService.js directly instead.');

export const useRealtimeSocket = () => {
  const [connectionStatus, setConnectionStatus] = useState({
    connected: false,
    reconnectAttempts: 0
  });

  useEffect(() => {
    const checkConnection = () => {
      setConnectionStatus({
        connected: socketService.isConnected(),
        reconnectAttempts: 0
      });
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    connectionStatus,
    notifications: [],
    broadcastNoticeUpdate: (notice, action) => {
      console.warn('Use socketService.sendAdminNoticeUpdate() instead');
      if (socketService.isConnected()) {
        socketService.sendAdminNoticeUpdate({
          type: action === 'create' ? 'NOTICE_CREATED' : 'NOTICE_UPDATED',
          notice,
          timestamp: new Date().toISOString()
        });
      }
    },
    broadcastContentUpdate: (content, action) => {
      console.warn('Use socketService.sendAdminContentUpdate() instead');
      if (socketService.isConnected()) {
        socketService.sendAdminContentUpdate({
          type: action === 'create' ? 'CONTENT_CREATED' : 'CONTENT_UPDATED',
          content,
          timestamp: new Date().toISOString()
        });
      }
    },
    broadcastEventUpdate: () => {},
    sendUserActivity: () => {},
    clearNotifications: () => {},
    removeNotification: () => {},
    isConnected: connectionStatus.connected
  };
};

export default useRealtimeSocket;