import React from 'react';
import { X, Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useRealtimeSocket } from '../../hooks/useRealtimeSocket';
import './RealtimeNotifications.css';

const RealtimeNotifications = () => {
  const { notifications, removeNotification, clearNotifications, connectionStatus } = useRealtimeSocket();

  if (notifications.length === 0) return null;

  const getNotificationIcon = (title) => {
    if (title.includes('Notice')) return <Bell className="h-4 w-4" />;
    if (title.includes('Event')) return <CheckCircle className="h-4 w-4" />;
    if (title.includes('Community')) return <Info className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  const getNotificationColor = (title) => {
    if (title.includes('Notice')) return 'bg-blue-500';
    if (title.includes('Event')) return 'bg-green-500';
    if (title.includes('Community')) return 'bg-purple-500';
    return 'bg-orange-500';
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {/* Connection Status */}
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
        connectionStatus.connected 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}>
        <div className={`w-2 h-2 rounded-full ${
          connectionStatus.connected ? 'bg-green-500' : 'bg-red-500'
        }`} />
        <span>
          {connectionStatus.connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* Notifications */}
      {notifications.map((notification, index) => (
        <div
          key={`${notification.timestamp}-${index}`}
          className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-slide-in-right"
        >
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-full text-white ${getNotificationColor(notification.title)}`}>
              {getNotificationIcon(notification.title)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 truncate">
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => removeNotification(index)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      {/* Clear All Button */}
      {notifications.length > 1 && (
        <button
          onClick={clearNotifications}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 px-3 rounded-lg transition-colors"
        >
          Clear All Notifications
        </button>
      )}
    </div>
  );
};

export default RealtimeNotifications;