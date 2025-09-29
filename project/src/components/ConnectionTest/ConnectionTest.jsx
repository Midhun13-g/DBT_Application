import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const ConnectionTest = () => {
  const [status, setStatus] = useState('testing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setStatus('testing');
      const response = await fetch('/api/test/health');
      
      if (response.ok) {
        const data = await response.json();
        setStatus('connected');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage('Backend connection failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Cannot connect to backend');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'testing':
        return <Loader className="h-5 w-5 animate-spin text-blue-500" />;
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg p-3 shadow-lg z-50">
      <div className="flex items-center space-x-2">
        {getStatusIcon()}
        <span className="text-sm font-medium">
          {status === 'testing' && 'Testing connection...'}
          {status === 'connected' && 'Backend connected'}
          {status === 'error' && 'Connection failed'}
        </span>
        <button
          onClick={testConnection}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          Retry
        </button>
      </div>
      {message && (
        <p className="text-xs text-gray-600 mt-1">{message}</p>
      )}
    </div>
  );
};

export default ConnectionTest;