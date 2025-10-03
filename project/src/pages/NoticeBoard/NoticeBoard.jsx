import React, { useState, useEffect } from 'react';
import { Bell, Calendar, MapPin, RefreshCw } from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import noticeService from '../../services/noticeService';

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = () => {
    noticeService.initializeDummyData();
    const adminNotices = noticeService.getNoticesFromStorage();
    console.log('User NoticeBoard - Admin notices:', adminNotices);
    const activeNotices = adminNotices.filter(notice => notice.isActive);
    console.log('User NoticeBoard - Active notices:', activeNotices);
    setNotices(activeNotices);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notice Board</h1>
            <p className="text-gray-600">Official announcements and important notices</p>
          </div>
          <Button onClick={loadNotices} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {notices.map((notice) => (
            <Card key={notice.id} className="border-l-4 border-blue-500">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{notice.title}</h3>
                    <p className="text-sm text-gray-500">{notice.author}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  notice.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                  notice.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {notice.priority}
                </span>
              </div>
              
              <p className="text-gray-700 mb-4">{notice.content}</p>
              
              {notice.eventDate && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(notice.eventDate).toLocaleDateString()}</span>
                </div>
              )}
              
              {notice.district && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{notice.district}</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoticeBoard;