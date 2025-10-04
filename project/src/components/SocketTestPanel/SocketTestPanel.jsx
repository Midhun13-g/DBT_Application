import React, { useState, useEffect } from 'react';
import { Activity, Send, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import socketService from '../../services/socketService';

const SocketTestPanel = () => {
  const [testResults, setTestResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const runSocketTests = async () => {
    setTesting(true);
    const results = [];

    // Test 1: Connection Status
    results.push({
      test: 'Socket Connection',
      status: socketService.isConnected() ? 'pass' : 'fail',
      message: socketService.isConnected() ? 'Connected' : 'Not connected'
    });

    // Test 2: Try to connect if not connected
    if (!socketService.isConnected()) {
      try {
        await socketService.connect();
        results.push({
          test: 'Connection Attempt',
          status: 'pass',
          message: 'Successfully connected'
        });
      } catch (error) {
        results.push({
          test: 'Connection Attempt',
          status: 'fail',
          message: error.message
        });
      }
    }

    // Test 3: Send test message
    try {
      socketService.sendAdminNoticeUpdate({
        type: 'TEST_MESSAGE',
        notice: { id: 'test', title: 'Test Notice' },
        timestamp: new Date().toISOString()
      });
      results.push({
        test: 'Send Test Message',
        status: 'pass',
        message: 'Test message sent successfully'
      });
    } catch (error) {
      results.push({
        test: 'Send Test Message',
        status: 'fail',
        message: error.message
      });
    }

    setTestResults(results);
    setTesting(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Socket Connection Test</h3>
        </div>
        <button
          onClick={runSocketTests}
          disabled={testing}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${testing ? 'animate-spin' : ''}`} />
          <span>{testing ? 'Testing...' : 'Run Tests'}</span>
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="space-y-3">
          {testResults.map((result, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {result.status === 'pass' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-medium">{result.test}</span>
              </div>
              <span className={`text-sm ${result.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                {result.message}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Socket Server:</strong> http://localhost:3001<br />
          <strong>Status:</strong> {socketService.isConnected() ? 'Connected' : 'Disconnected'}
        </p>
      </div>
    </div>
  );
};

export default SocketTestPanel;