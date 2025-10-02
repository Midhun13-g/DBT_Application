import React, { useState } from 'react';
import { ArrowRight, RefreshCw, Eye, Settings } from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import noticeService from '../../services/noticeService';

const NoticeTest = () => {
  const [adminNotices, setAdminNotices] = useState([]);
  const [communityNotices, setCommunityNotices] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    setLoading(true);
    
    // Initialize dummy data if needed
    noticeService.initializeDummyData();
    
    // Get admin format notices
    const adminData = noticeService.getNoticesFromStorage();
    setAdminNotices(adminData);
    
    // Get community format notices
    const communityData = noticeService.getNoticesForCommunity();
    setCommunityNotices(communityData);
    
    setLoading(false);
  };

  const addTestNotice = async () => {
    const testNotice = {
      title: `Test Notice ${Date.now()}`,
      content: 'This is a test notice created to demonstrate the data flow between admin and community sections.',
      type: 'GENERAL',
      priority: 'MEDIUM',
      district: 'Test District',
      eventDate: new Date().toISOString(),
      isActive: true
    };

    try {
      await noticeService.createNotice(testNotice);
      loadData();
    } catch (error) {
      console.error('Error creating test notice:', error);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Notice Board Data Flow Test
          </h1>
          <p className="text-gray-600">
            This page demonstrates how data flows between admin and community notice boards
          </p>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <Button onClick={loadData} disabled={loading} className="flex items-center space-x-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </Button>
          <Button onClick={addTestNotice} variant="outline" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Add Test Notice</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Admin Format */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Admin Format ({adminNotices.length})
              </h2>
              <div className="bg-blue-100 p-2 rounded-lg">
                <Settings className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {adminNotices.map((notice) => (
                <div key={notice.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">
                        {notice.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {notice.content.substring(0, 80)}...
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {notice.type}
                        </span>
                        <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                          {notice.priority}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          notice.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {notice.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Eye className="h-3 w-3" />
                      <span>{notice.views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Arrow */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="text-center">
              <ArrowRight className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Data Flow</p>
            </div>
          </div>

          {/* Community Format */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Community Format ({communityNotices.length})
              </h2>
              <div className="bg-green-100 p-2 rounded-lg">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {communityNotices.map((notice) => (
                <div key={notice.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">
                        {notice.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {notice.description.substring(0, 80)}...
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {notice.type}
                        </span>
                        <span className="text-xs bg-purple-100 px-2 py-1 rounded">
                          {notice.district}
                        </span>
                        {notice.featured && (
                          <span className="text-xs bg-yellow-100 px-2 py-1 rounded">
                            Featured
                          </span>
                        )}
                      </div>
                      {notice.date && (
                        <p className="text-xs text-gray-500 mt-1">
                          📅 {notice.date} {notice.time}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                        <Eye className="h-3 w-3" />
                        <span>{notice.views}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        👍 {notice.likes} 🔖 {notice.bookmarks}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            How to Test the Data Flow
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-lg mb-3 inline-block">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">1. Admin Management</h4>
              <p className="text-sm text-gray-600">
                Go to Admin → Notice Board to create, edit, or delete notices
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-lg mb-3 inline-block">
                <ArrowRight className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">2. Data Sync</h4>
              <p className="text-sm text-gray-600">
                Changes are automatically synced via localStorage and service layer
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-lg mb-3 inline-block">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">3. Community View</h4>
              <p className="text-sm text-gray-600">
                Visit Community Events to see notices in user-friendly format
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NoticeTest;