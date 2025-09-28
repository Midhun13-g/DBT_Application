import React, { useState, useEffect } from 'react';
import { Bell, Check, X, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { formatDate } from '../../utils/helpers';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mock notifications data
    const mockNotifications = [
      {
        id: 1,
        type: 'success',
        title: 'DBT Status Updated',
        message: 'Your DBT status has been successfully enabled.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false
      },
      {
        id: 2,
        type: 'info',
        title: 'Camp Booking Confirmed',
        message: 'Your camp booking for Delhi - Connaught Place has been confirmed.',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        read: false
      },
      {
        id: 3,
        type: 'warning',
        title: 'Document Verification Pending',
        message: 'Please upload your Aadhaar document for verification.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: true
      },
      {
        id: 4,
        type: 'error',
        title: 'DBT Link Failed',
        message: 'Unable to link your bank account. Please try again.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        read: true
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Notifications
          </h1>
          <p className="text-gray-600">
            Stay updated with your DBT application status and important alerts
          </p>
        </div>

        {/* Filter and Actions */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Notifications</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
            
            <Button
              variant="outline"
              onClick={markAllAsRead}
              disabled={notifications.every(n => n.read)}
            >
              Mark All as Read
            </Button>
          </div>
        </Card>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No notifications
                </h3>
                <p className="text-gray-500">
                  {filter === 'unread' 
                    ? "You're all caught up! No unread notifications."
                    : "You don't have any notifications yet."
                  }
                </p>
              </div>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card key={notification.id} className={`${!notification.read ? 'border-l-4 border-l-blue-500' : ''}`}>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          {formatDate(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;