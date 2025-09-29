import React, { useState } from 'react';
import { Search, Filter, Download, Globe, MessageSquare, Phone } from 'lucide-react';
import Card from '../../../components/Card/Card';
import Button from '../../../components/Button/Button';

const AccessLogs = () => {
  const [logs] = useState([
    {
      id: 1,
      timestamp: '2024-01-28 14:30:25',
      channel: 'Web',
      userId: 'user123',
      aadhaarLast4: '1234',
      status: 'ENABLED',
      ipAddress: '192.168.1.100',
      location: 'Mumbai, Maharashtra',
      responseTime: '1.2s'
    },
    {
      id: 2,
      timestamp: '2024-01-28 14:25:10',
      channel: 'WhatsApp',
      userId: 'wa_user456',
      aadhaarLast4: '5678',
      status: 'NOT_LINKED',
      ipAddress: 'N/A',
      location: 'Delhi, Delhi',
      responseTime: '0.8s'
    },
    {
      id: 3,
      timestamp: '2024-01-28 14:20:45',
      channel: 'IVR',
      userId: 'ivr_789',
      aadhaarLast4: '9012',
      status: 'LINKED_NOT_ENABLED',
      ipAddress: 'N/A',
      location: 'Bangalore, Karnataka',
      responseTime: '2.1s'
    }
  ]);

  const [filterChannel, setFilterChannel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'Web': return <Globe className="h-4 w-4 text-blue-500" />;
      case 'WhatsApp': return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'IVR': return <Phone className="h-4 w-4 text-purple-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      'ENABLED': 'bg-green-100 text-green-800',
      'LINKED_NOT_ENABLED': 'bg-yellow-100 text-yellow-800',
      'NOT_LINKED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredLogs = logs.filter(log => {
    const matchesChannel = filterChannel === 'all' || log.channel === filterChannel;
    const matchesSearch = log.aadhaarLast4.includes(searchTerm) || log.userId.includes(searchTerm);
    return matchesChannel && matchesSearch;
  });

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Channel', 'User ID', 'Aadhaar Last 4', 'Status', 'IP Address', 'Location', 'Response Time'],
      ...filteredLogs.map(log => [
        log.timestamp,
        log.channel,
        log.userId,
        log.aadhaarLast4,
        log.status,
        log.ipAddress,
        log.location,
        log.responseTime
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dbt_access_logs.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">DBT Access Logs</h1>
        <Button icon={Download} onClick={exportLogs}>
          Export Logs
        </Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Search by Aadhaar or User ID..."
              />
            </div>
            
            <select
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Channels</option>
              <option value="Web">Web</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="IVR">IVR</option>
            </select>
          </div>

          <div className="flex space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-blue-500" />
              <span>Web: {logs.filter(l => l.channel === 'Web').length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-green-500" />
              <span>WhatsApp: {logs.filter(l => l.channel === 'WhatsApp').length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-purple-500" />
              <span>IVR: {logs.filter(l => l.channel === 'IVR').length}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Channel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aadhaar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Response Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      {getChannelIcon(log.channel)}
                      <span>{log.channel}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ****{log.aadhaarLast4}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(log.status)}`}>
                      {log.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.responseTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AccessLogs;