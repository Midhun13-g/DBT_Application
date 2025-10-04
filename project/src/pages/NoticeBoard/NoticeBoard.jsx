import React, { useState, useEffect } from 'react';
import { Bell, RefreshCw, Wifi, WifiOff, Filter, Eye, MapPin, User, Calendar, FileText, Tag, Phone } from 'lucide-react';
import socketService from '../../services/socketService';

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const loadNotices = () => {
    try {
      const stored = localStorage.getItem('notices');
      let storedNotices = [];
      
      if (!stored) {
        storedNotices = [];
      } else {
        try {
          storedNotices = JSON.parse(stored);
        } catch (error) {
          console.error('Error parsing stored notices:', error);
          storedNotices = [];
        }
      }
      
      if (storedNotices.length === 0) {
        // Initialize with comprehensive dummy data
        const dummyNotices = [
          {
            id: 1,
            title: "New Digital India Initiative Launch",
            content: "Government launches new digital literacy program for rural areas. Free training sessions available for all citizens.",
            description: "This comprehensive program aims to bridge the digital divide by providing free computer and internet training to rural communities. Sessions include basic computer skills, online government services, and digital payment methods.",
            priority: "HIGH",
            category: "SCHEME",
            district: "All Districts",
            targetAudience: "ALL",
            author: "Digital India Team",
            validFrom: new Date().toISOString(),
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            contactInfo: "Call 1800-111-555 or visit nearest CSC center",
            attachmentUrl: "https://digitalindia.gov.in",
            tags: ["digital literacy", "training", "rural development"],
            isActive: true,
            isUrgent: false,
            requiresAction: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            title: "Pradhan Mantri Kisan Samman Nidhi - Registration Open",
            content: "Farmers can now register for PM-KISAN scheme. Direct benefit transfer of ₹6000 annually in three installments.",
            description: "The PM-KISAN scheme provides income support to farmer families. Eligible farmers receive ₹2000 every four months directly to their bank accounts. Registration is now open for new beneficiaries.",
            priority: "URGENT",
            category: "SCHEME",
            district: "Rural Districts",
            targetAudience: "FARMERS",
            author: "Agriculture Department",
            validFrom: new Date().toISOString(),
            validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            contactInfo: "Visit nearest Agriculture Office or call 14447",
            tags: ["farmers", "subsidy", "registration", "PM-KISAN"],
            isActive: true,
            isUrgent: true,
            requiresAction: true,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 3,
            title: "Ayushman Bharat Health Card Distribution",
            content: "Free health insurance cards being distributed. Coverage up to ₹5 lakh per family per year for medical treatment.",
            description: "Ayushman Bharat provides comprehensive health coverage to eligible families. The scheme covers hospitalization costs, pre and post-hospitalization expenses, and daycare procedures at empaneled hospitals.",
            priority: "NORMAL",
            category: "SCHEME",
            district: "Delhi",
            targetAudience: "ALL",
            author: "Health Department",
            validFrom: new Date().toISOString(),
            contactInfo: "Visit nearest PHC or call 14555",
            tags: ["health insurance", "Ayushman Bharat", "medical coverage"],
            isActive: true,
            isUrgent: false,
            requiresAction: false,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 4,
            title: "Women Entrepreneurship Development Program",
            content: "Special training and loan schemes for women entrepreneurs. Apply now for skill development and financial assistance.",
            description: "This program supports women in starting and scaling their businesses. Includes entrepreneurship training, mentorship, market linkages, and easy access to credit facilities with subsidized interest rates.",
            priority: "HIGH",
            category: "SCHEME",
            district: "Mumbai",
            targetAudience: "WOMEN",
            author: "Women Development Department",
            validFrom: new Date().toISOString(),
            validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            contactInfo: "Email: women.dev@gov.in or call 1800-233-4567",
            tags: ["women empowerment", "entrepreneurship", "loans", "skill development"],
            isActive: true,
            isUrgent: false,
            requiresAction: true,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        
        localStorage.setItem('notices', JSON.stringify(dummyNotices));
        storedNotices = dummyNotices;
      } else {
        try {
          storedNotices = JSON.parse(stored);
          // Ensure notices have all required fields
          storedNotices = storedNotices.map(notice => ({
            ...notice,
            tags: notice.tags || [],
            isActive: notice.isActive !== false,
            isUrgent: notice.isUrgent || false,
            requiresAction: notice.requiresAction || false,
            views: notice.views || 0
          }));
        } catch (parseError) {
          console.error('Error parsing stored notices:', parseError);
          storedNotices = [];
        }
      }
      
      const activeNotices = storedNotices.filter(n => n.isActive === true);
      setNotices(activeNotices);
      filterNotices(activeNotices, selectedPriority);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading notices:', error);
      setNotices([]);
      setFilteredNotices([]);
    }
  };

  const filterNotices = (noticeList, priority) => {
    if (priority === 'ALL') {
      setFilteredNotices(noticeList);
    } else {
      setFilteredNotices(noticeList.filter(n => n.priority === priority));
    }
  };

  const handlePriorityFilter = (priority) => {
    setSelectedPriority(priority);
    filterNotices(notices, priority);
  };

  useEffect(() => {
    loadNotices();
    
    // Initialize socket connection
    const initSocket = async () => {
      try {
        await socketService.connect();
        const user = JSON.parse(localStorage.getItem('dbt_user') || '{}');
        if (user.id) {
          socketService.registerUser({
            userId: user.id,
            role: user.role || 'user',
            name: user.name || 'User'
          });
        }
        setIsConnected(true);
      } catch (error) {
        console.warn('Socket connection failed:', error);
        setIsConnected(false);
      }
    };
    
    initSocket();
    
    // Listen for real-time notice updates
    const handleNoticeUpdate = (event) => {
      loadNotices();
    };
    
    window.addEventListener('noticeUpdate', handleNoticeUpdate);
    
    // Check connection status periodically
    const statusInterval = setInterval(() => {
      setIsConnected(socketService.isConnected());
    }, 3000);
    
    // Fallback polling for offline mode
    const pollInterval = setInterval(() => {
      if (!socketService.isConnected()) {
        loadNotices();
      }
    }, 10000);
    
    return () => {
      window.removeEventListener('noticeUpdate', handleNoticeUpdate);
      clearInterval(statusInterval);
      clearInterval(pollInterval);
    };
  }, []);

  const handleRefresh = () => {
    loadNotices();
  };

  const viewNoticeDetails = (notice) => {
    setSelectedNotice(notice);
    setShowDetailModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Notice Board</h1>
            <p className="text-xl text-gray-600 mb-4">Stay informed with the latest announcements and updates</p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-blue-600" />
                <span className="text-lg font-medium text-gray-700">{filteredNotices.length} Active Notices</span>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                isConnected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                <span>{isConnected ? 'Live Updates' : 'Offline Mode'}</span>
              </div>
              {lastUpdate && (
                <p className="text-sm text-gray-500">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors shadow-md"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Priority Filter */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Filter className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter by Priority:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['ALL', 'URGENT', 'HIGH', 'NORMAL'].map((priority) => (
              <button
                key={priority}
                onClick={() => handlePriorityFilter(priority)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedPriority === priority
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {priority === 'ALL' ? 'All Notices' : priority}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredNotices.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Bell className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {selectedPriority === 'ALL' ? 'No notices available' : `No ${selectedPriority.toLowerCase()} priority notices`}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {selectedPriority === 'ALL' 
                  ? 'Stay tuned! New announcements and important updates will appear here.'
                  : `Try selecting a different priority filter or check back later.`
                }
              </p>
            </div>
          ) : (
            filteredNotices.map((notice) => (
              <div key={notice.id} className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 p-6 group transform hover:-translate-y-1 ${
                notice.priority === 'URGENT' ? 'border-red-500 bg-red-50' :
                notice.priority === 'HIGH' ? 'border-orange-500 bg-orange-50' :
                'border-blue-500 bg-white'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      notice.priority === 'URGENT' ? 'bg-red-100' :
                      notice.priority === 'HIGH' ? 'bg-orange-100' :
                      'bg-blue-100'
                    }`}>
                      <Bell className={`h-5 w-5 ${
                        notice.priority === 'URGENT' ? 'text-red-600' :
                        notice.priority === 'HIGH' ? 'text-orange-600' :
                        'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">{notice.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-sm text-gray-500">{notice.author || 'Government Admin'}</p>
                        {notice.category && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            {notice.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      notice.priority === 'URGENT' ? 'bg-red-100 text-red-800 animate-pulse' :
                      notice.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {notice.priority || 'NORMAL'}
                    </span>
                    {notice.isUrgent && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full font-medium animate-pulse">
                        URGENT
                      </span>
                    )}
                    {notice.requiresAction && (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-600 rounded-full font-medium">
                        Action Required
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">{notice.content}</p>
                
                {notice.tags && notice.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {notice.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        #{tag}
                      </span>
                    ))}
                    {notice.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{notice.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    {notice.district && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {notice.district}
                      </span>
                    )}
                    {notice.targetAudience && notice.targetAudience !== 'ALL' && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                        {notice.targetAudience.replace('_', ' ')}
                      </span>
                    )}
                    <span>{new Date(notice.createdAt).toLocaleDateString('en-IN')}</span>
                    {notice.validUntil && (
                      <span className="text-red-500">
                        Valid until: {new Date(notice.validUntil).toLocaleDateString('en-IN')}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => viewNoticeDetails(notice)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors flex items-center space-x-1"
                  >
                    <Eye className="h-3 w-3" />
                    <span>Learn More</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Notice Details Modal */}
        {showDetailModal && selectedNotice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Notice Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{selectedNotice.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      selectedNotice.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                      selectedNotice.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedNotice.priority || 'NORMAL'} Priority
                    </span>
                    {selectedNotice.category && (
                      <span className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full font-medium">
                        {selectedNotice.category}
                      </span>
                    )}
                    {selectedNotice.targetAudience && selectedNotice.targetAudience !== 'ALL' && (
                      <span className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full font-medium">
                        {selectedNotice.targetAudience.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Notice Content</h4>
                  <p className="text-blue-800 leading-relaxed">{selectedNotice.content}</p>
                  {selectedNotice.description && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <h5 className="font-medium text-blue-900 mb-2">Additional Details</h5>
                      <p className="text-blue-700 leading-relaxed">{selectedNotice.description}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-600" />
                      <span>Notice Information</span>
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Author:</span>
                        <span className="font-medium">{selectedNotice.author || 'Government Admin'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Published:</span>
                        <span className="font-medium">{new Date(selectedNotice.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                      {selectedNotice.district && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">District:</span>
                          <span className="font-medium">{selectedNotice.district}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-gray-600" />
                      <span>Validity & Contact</span>
                    </h4>
                    <div className="space-y-2 text-sm">
                      {selectedNotice.validFrom && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Valid From:</span>
                          <span className="font-medium">{new Date(selectedNotice.validFrom).toLocaleDateString('en-IN')}</span>
                        </div>
                      )}
                      {selectedNotice.validUntil && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Valid Until:</span>
                          <span className="font-medium text-red-600">{new Date(selectedNotice.validUntil).toLocaleDateString('en-IN')}</span>
                        </div>
                      )}
                      {selectedNotice.contactInfo && (
                        <div>
                          <span className="text-gray-600">Contact:</span>
                          <p className="font-medium mt-1">{selectedNotice.contactInfo}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {selectedNotice.attachmentUrl && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      <span>Additional Resources</span>
                    </h4>
                    <a 
                      href={selectedNotice.attachmentUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 hover:underline font-medium"
                    >
                      View Attachment/Document
                    </a>
                  </div>
                )}

                {selectedNotice.tags && selectedNotice.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <Tag className="h-5 w-5 text-gray-600" />
                      <span>Related Topics</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedNotice.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedNotice.isUrgent || selectedNotice.requiresAction) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-900 mb-2">Important Notice</h4>
                    <div className="space-y-1 text-sm text-yellow-800">
                      {selectedNotice.isUrgent && (
                        <p>• This is marked as an urgent notice</p>
                      )}
                      {selectedNotice.requiresAction && (
                        <p>• This notice requires citizen action</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-6 border-t mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeBoard;