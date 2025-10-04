import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import socketService from '../../services/socketService';

const SocketStatus = () => {
  const [status, setStatus] = useState({
    connected: false,
    connecting: false,
    error: null
  });

  useEffect(() => {
    const checkStatus = () => {
      setStatus(prev => ({
        ...prev,
        connected: socketService.isConnected()
      }));
    };

    checkStatus();
    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleReconnect = async () => {
    setStatus(prev => ({ ...prev, connecting: true, error: null }));
    try {
      await socketService.connect();
      setStatus(prev => ({ ...prev, connecting: false, connected: true }));
    } catch (error) {
      setStatus(prev => ({ 
        ...prev, 
        connecting: false, 
        connected: false, 
        error: error.message 
      }));
    }
  };

  return (
    <div className="flex items-center space-x-2 text-sm">
      {status.connected ? (
        <div className="flex items-center text-green-600">
          <Wifi className="h-4 w-4 mr-1" />
          <span>Socket Connected</span>
        </div>
      ) : (
        <div className="flex items-center text-red-600">
          <WifiOff className="h-4 w-4 mr-1" />
          <span>Socket Disconnected</span>
          <button
            onClick={handleReconnect}
            disabled={status.connecting}
            className="ml-2 p-1 hover:bg-gray-100 rounded"
          >
            <RefreshCw className={`h-3 w-3 ${status.connecting ? 'animate-spin' : ''}`} />
          </button>
        </div>
      )}
      {status.error && (
        <span className="text-xs text-red-500">({status.error})</span>
      )}
    </div>
  );
};

export default SocketStatus;