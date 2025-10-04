import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Bell, Wifi, WifiOff, Edit, Eye, Calendar, MapPin, User, AlertCircle, FileText, Tag } from 'lucide-react';
import socketService from '../../services/socketService';
import { useAuth } from '../../hooks/useAuth';

const AdminNoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    description: '',
    priority: 'NORMAL',
    category: 'GENERAL',
    district: '',
    targetAudience: 'ALL',
    validFrom: '',
    validUntil: '',
    contactInfo: '',
    attachmentUrl: '',
    tags: '',
    isActive: true,
    isUrgent: false,
    requiresAction: false
  });
  
  const { user } = useAuth();

  useEffect(() => {
    loadNotices();
    
    const initSocket = async () => {
      try {
        await socketService.connect();
        if (user) {
          socketService.registerUser({
            userId: user.id,
            role: user.role || 'admin',
            name: user.name || 'Admin'
          });
        }
        setIsConnected(true);
      } catch (error) {
        console.warn('Socket connection failed:', error);
        setIsConnected(false);
      }
    };
    
    initSocket();
    
    const statusInterval = setInterval(() => {
      setIsConnected(socketService.isConnected());
    }, 2000);
    
    return () => {
      clearInterval(statusInterval);
    };
  }, [user]);
  
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
      
      // Dummy data is now handled by DummyDataInitializer component
      // No need to reinitialize here
      
      setNotices(storedNotices);
    } catch (error) {
      console.error('Error loading notices:', error);
      setNotices([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill title and content');
      return;
    }
    
    try {
      let existingNotices = JSON.parse(localStorage.getItem('notices') || '[]');
      
      // Don't reinitialize dummy data if notices already exist
      // The DummyDataInitializer component handles initial data setup
      
      const newNotice = {
        ...formData,
        id: Date.now(),
        author: user?.name || 'Admin',
        authorRole: user?.role || 'admin',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      };
      
      const updatedNotices = [newNotice, ...existingNotices];
      localStorage.setItem('notices', JSON.stringify(updatedNotices));
      setNotices(updatedNotices);
      
      if (socketService.isConnected()) {
        const updateData = {
          type: 'NOTICE_CREATED',
          notice: newNotice,
          timestamp: new Date().toISOString(),
          adminUser: user?.name || 'Admin'
        };
        
        socketService.sendAdminNoticeUpdate(updateData);
      }
      
      window.dispatchEvent(new CustomEvent('noticeUpdate', {
        detail: {
          type: 'NOTICE_CREATED',
          notice: newNotice,
          timestamp: new Date().toISOString()
        }
      }));
      
      setFormData({
        title: '', content: '', description: '', priority: 'NORMAL', category: 'GENERAL',
        district: '', targetAudience: 'ALL', validFrom: '', validUntil: '',
        contactInfo: '', attachmentUrl: '', tags: '', isActive: true,
        isUrgent: false, requiresAction: false
      });
      setShowModal(false);
    } catch (error) {
      console.error('Error saving notice:', error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete notice?')) {
      try {
        const deletedNotice = notices.find(n => n.id === id);
        const updatedNotices = notices.filter(n => n.id !== id);
        localStorage.setItem('notices', JSON.stringify(updatedNotices));
        setNotices(updatedNotices);
        
        if (socketService.isConnected() && deletedNotice) {
          const updateData = {
            type: 'NOTICE_DELETED',
            notice: deletedNotice,
            allNotices: updatedNotices,
            timestamp: new Date().toISOString(),
            adminUser: user?.name || 'Admin'
          };
          
          socketService.sendAdminNoticeUpdate(updateData);
        }
        
        // Trigger local event for immediate update
        window.dispatchEvent(new CustomEvent('noticeUpdate', {
          detail: {
            type: 'NOTICE_DELETED',
            notice: deletedNotice,
            allNotices: updatedNotices,
            timestamp: new Date().toISOString()
          }
        }));
      } catch (error) {
        console.error('Error deleting notice:', error);
        alert('Error deleting notice. Please try again.');
      }
    }
  };

  const toggleNoticeStatus = (id) => {
    try {
      const updatedNotices = notices.map(notice => 
        notice.id === id ? { ...notice, isActive: !notice.isActive } : notice
      );
      localStorage.setItem('notices', JSON.stringify(updatedNotices));
      setNotices(updatedNotices);
      
      if (socketService.isConnected()) {
        socketService.sendAdminNoticeUpdate({
          type: 'NOTICE_UPDATED',
          allNotices: updatedNotices,
          timestamp: new Date().toISOString(),
          adminUser: user?.name || 'Admin'
        });
      }
      
      // Trigger local event for immediate update
      window.dispatchEvent(new CustomEvent('noticeUpdate', {
        detail: {
          type: 'NOTICE_UPDATED',
          allNotices: updatedNotices,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error) {
      console.error('Error updating notice status:', error);
    }
  };

  const viewNoticeDetails = (notice) => {
    setSelectedNotice(notice);
    setShowDetailModal(true);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Notice Board Management</h1>
            <p className="text-xl text-gray-600">Create and manage public announcements</p>
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-blue-600" />
                <span className="text-lg font-medium text-gray-700">{notices.length} Total Notices</span>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                isConnected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                <span>{isConnected ? 'Live Updates Active' : 'Offline Mode'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus className="h-5 w-5" />
            <span>Create Notice</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {notices.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Bell className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No notices created</h3>
              <p className="text-gray-500 max-w-md mx-auto">Create your first notice to start communicating with citizens.</p>
            </div>
          ) : (
            notices.map((notice) => (
              <div key={notice.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 group">
                <div className="flex justify-between items-start mb-4">
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
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{notice.title}</h3>
                      <p className="text-sm text-gray-500">{notice.author} • {notice.category}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      notice.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                      notice.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {notice.priority}
                    </span>
                    <button
                      onClick={() => toggleNoticeStatus(notice.id)}
                      className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                        notice.isActive 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {notice.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-3">{notice.content}</p>

                <div className="space-y-2 mb-4">
                  {notice.district && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{notice.district}</span>
                    </div>
                  )}
                  
                  {notice.targetAudience && notice.targetAudience !== 'ALL' && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>{notice.targetAudience.replace('_', ' ')}</span>
                    </div>
                  )}

                  {notice.validUntil && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Valid until: {new Date(notice.validUntil).toLocaleDateString()}</span>
                    </div>
                  )}

                  {notice.tags && notice.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {notice.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                      {notice.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{notice.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => viewNoticeDetails(notice)}
                      className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(notice.id)}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Notice"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Notice Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">Create New Notice</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notice Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter a clear and descriptive title"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Main Content *</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter the main notice content that will be displayed to users"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Additional details, background information, or instructions"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="NORMAL">Normal</option>
                      <option value="HIGH">High Priority</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="GENERAL">General Announcement</option>
                      <option value="SCHEME">Government Scheme</option>
                      <option value="EVENT">Event Notification</option>
                      <option value="ALERT">Alert/Warning</option>
                      <option value="UPDATE">System Update</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target District</label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => setFormData({...formData, district: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Specific district or leave blank for all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                    <select
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ALL">All Citizens</option>
                      <option value="FARMERS">Farmers</option>
                      <option value="WOMEN">Women</option>
                      <option value="YOUTH">Youth</option>
                      <option value="SENIOR_CITIZENS">Senior Citizens</option>
                      <option value="BUSINESS_OWNERS">Business Owners</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valid From</label>
                    <input
                      type="datetime-local"
                      value={formData.validFrom}
                      onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valid Until</label>
                    <input
                      type="datetime-local"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Information</label>
                    <input
                      type="text"
                      value={formData.contactInfo}
                      onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Phone, email, or office address for inquiries"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Attachment URL</label>
                    <input
                      type="url"
                      value={formData.attachmentUrl}
                      onChange={(e) => setFormData({...formData, attachmentUrl: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Link to documents, forms, or additional resources"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Comma-separated tags (e.g., pension, healthcare, education)"
                    />
                  </div>

                  <div className="md:col-span-2 flex flex-wrap gap-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Publish immediately</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isUrgent"
                        checked={formData.isUrgent}
                        onChange={(e) => setFormData({...formData, isUrgent: e.target.checked})}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isUrgent" className="ml-2 block text-sm text-gray-900">Mark as urgent</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="requiresAction"
                        checked={formData.requiresAction}
                        onChange={(e) => setFormData({...formData, requiresAction: e.target.checked})}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor="requiresAction" className="ml-2 block text-sm text-gray-900">Requires citizen action</label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                  >
                    Create Notice
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Notice Details Modal */}
        {showDetailModal && selectedNotice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Notice Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedNotice.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      selectedNotice.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                      selectedNotice.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedNotice.priority} Priority
                    </span>
                    <span className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full">
                      {selectedNotice.category}
                    </span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      selectedNotice.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedNotice.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Main Content</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedNotice.content}</p>
                </div>

                {selectedNotice.description && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Detailed Description</h4>
                    <p className="text-gray-700 leading-relaxed">{selectedNotice.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Notice Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>Author: {selectedNotice.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>Created: {new Date(selectedNotice.createdAt).toLocaleString()}</span>
                      </div>
                      {selectedNotice.district && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>District: {selectedNotice.district}</span>
                        </div>
                      )}
                      {selectedNotice.targetAudience && selectedNotice.targetAudience !== 'ALL' && (
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span>Target: {selectedNotice.targetAudience.replace('_', ' ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Validity & Contact</h4>
                    <div className="space-y-2 text-sm">
                      {selectedNotice.validFrom && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>Valid from: {new Date(selectedNotice.validFrom).toLocaleString()}</span>
                        </div>
                      )}
                      {selectedNotice.validUntil && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>Valid until: {new Date(selectedNotice.validUntil).toLocaleString()}</span>
                        </div>
                      )}
                      {selectedNotice.contactInfo && (
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span>Contact: {selectedNotice.contactInfo}</span>
                        </div>
                      )}
                      {selectedNotice.attachmentUrl && (
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <a href={selectedNotice.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            View Attachment
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {selectedNotice.tags && selectedNotice.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedNotice.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-6 border-t mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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

export default AdminNoticeBoard;