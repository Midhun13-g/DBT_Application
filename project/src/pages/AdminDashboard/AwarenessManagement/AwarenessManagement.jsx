import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, BookOpen, Video, FileText, Image, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import Card from '../../../components/Card/Card';
import Button from '../../../components/Button/Button';
import Modal from '../../../components/Modal/Modal';
import ErrorBoundary from '../../../components/ErrorBoundary/ErrorBoundary';
import socketService from '../../../services/socketService';
import dataService from '../../../services/dataService';
import { useAuth } from '../../../hooks/useAuth';

const AwarenessManagement = () => {
  const [awareness, setAwareness] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    description: '',
    category: 'EDUCATION',
    mediaType: 'ARTICLE',
    pdfFile: null,
    pdfUrl: '',
    videoUrl: '',
    imageUrl: '',
    tags: '',
    targetAudience: 'ALL',
    priority: 'NORMAL',
    isActive: true,
    isFeatured: false
  });
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Initialize socket connection
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
    
    // Check connection status periodically
    const statusInterval = setInterval(() => {
      setIsConnected(socketService.isConnected());
    }, 2000);
    
    // Load awareness content from localStorage with delay
    const loadAwareness = () => {
      const stored = localStorage.getItem('awarenessContent');
      if (stored) {
        try {
          const storedAwareness = JSON.parse(stored);
          setAwareness(storedAwareness);
        } catch (error) {
          console.error('Error parsing stored awareness content:', error);
          setAwareness([]);
        }
      } else {
        setAwareness([]);
      }
    };

    loadAwareness();
    
    return () => {
      clearInterval(statusInterval);
    };
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!formData.content.trim()) {
      alert('Please enter content');
      return;
    }
    
    try {
      let awarenessContent = JSON.parse(localStorage.getItem('awarenessContent') || '[]');
      
      // Dummy data is now handled by DummyDataInitializer component
      
      if (editingItem) {
        const index = awarenessContent.findIndex(a => a.id === editingItem.id);
        if (index !== -1) {
          awarenessContent[index] = { 
            ...awarenessContent[index], 
            ...formData, 
            tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
            updatedAt: new Date().toISOString() 
          };
        }
      } else {
        const newContent = {
          ...formData,
          id: Date.now(),
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        awarenessContent.unshift(newContent);
      }
      
      await dataService.saveData('awarenessContent', awarenessContent);
      setAwareness(awarenessContent);
      
      // Send real-time update via Socket.IO
      if (socketService.isConnected()) {
        const updateData = {
          type: editingItem ? 'CONTENT_UPDATED' : 'CONTENT_CREATED',
          content: editingItem ? 
            awarenessContent.find(a => a.id === editingItem.id) : 
            awarenessContent[0],
          allContent: awarenessContent,
          timestamp: new Date().toISOString(),
          adminUser: user?.name || 'Admin'
        };
        
        socketService.sendAdminContentUpdate(updateData);
      }
      
      // Trigger local event for immediate update
      window.dispatchEvent(new CustomEvent('contentUpdate', {
        detail: {
          type: editingItem ? 'CONTENT_UPDATED' : 'CONTENT_CREATED',
          content: editingItem ? 
            awarenessContent.find(a => a.id === editingItem.id) : 
            awarenessContent[0],
          timestamp: new Date().toISOString()
        }
      }));
      
      resetForm();
    } catch (error) {
      console.error('Error saving awareness content:', error);
      alert('Error saving content. Please try again.');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content,
      description: item.description || '',
      category: item.category,
      mediaType: item.mediaType,
      pdfFile: null,
      pdfUrl: item.pdfUrl || '',
      videoUrl: item.videoUrl || '',
      imageUrl: item.imageUrl || '',
      tags: item.tags ? item.tags.join(', ') : '',
      targetAudience: item.targetAudience || 'ALL',
      priority: item.priority || 'NORMAL',
      isActive: item.isActive,
      isFeatured: item.isFeatured || false
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        const awarenessContent = JSON.parse(localStorage.getItem('awarenessContent') || '[]');
        const filteredContent = awarenessContent.filter(a => a.id !== id);
        localStorage.setItem('awarenessContent', JSON.stringify(filteredContent));
        setAwareness(filteredContent);
        
        // Send real-time update
        if (socketService.isConnected()) {
          socketService.sendAdminContentUpdate({
            type: 'CONTENT_DELETED',
            contentId: id,
            allContent: filteredContent,
            timestamp: new Date().toISOString(),
            adminUser: user?.name || 'Admin'
          });
        }
        
        window.dispatchEvent(new CustomEvent('contentUpdate', {
          detail: {
            type: 'CONTENT_DELETED',
            contentId: id,
            allContent: filteredContent,
            timestamp: new Date().toISOString()
          }
        }));
      } catch (error) {
        console.error('Error deleting content:', error);
        alert('Error deleting content. Please try again.');
      }
    }
  };

  const handleView = (item) => {
    setViewingItem(item);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      description: '',
      category: 'EDUCATION',
      mediaType: 'ARTICLE',
      pdfFile: null,
      pdfUrl: '',
      videoUrl: '',
      imageUrl: '',
      tags: '',
      targetAudience: 'ALL',
      priority: 'NORMAL',
      isActive: true,
      isFeatured: false
    });
    setEditingItem(null);
    setShowModal(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          pdfFile: file,
          pdfUrl: event.target.result
        });
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid PDF file');
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'EDUCATION': return 'bg-blue-100 text-blue-800';
      case 'HEALTH': return 'bg-green-100 text-green-800';
      case 'FINANCE': return 'bg-purple-100 text-purple-800';
      case 'TECHNOLOGY': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMediaIcon = (mediaType) => {
    switch (mediaType) {
      case 'VIDEO': return Video;
      case 'ARTICLE': return FileText;
      case 'INFOGRAPHIC': return Image;
      default: return BookOpen;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date specified';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Awareness Content Management
            </h1>
            <div className="flex items-center space-x-4">
              <p className="text-gray-600">
                Create and manage educational content for users
              </p>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                isConnected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                <span>{isConnected ? 'Live Updates Active' : 'Offline Mode'}</span>
              </div>
            </div>
          </div>
          <Button onClick={() => setShowModal(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Content</span>
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Content</p>
                <p className="text-2xl font-bold text-gray-900">{awareness.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Content</p>
                <p className="text-2xl font-bold text-green-600">
                  {awareness.filter(a => a.isActive).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Videos</p>
                <p className="text-2xl font-bold text-purple-600">
                  {awareness.filter(a => a.mediaType === 'VIDEO').length}
                </p>
              </div>
              <Video className="h-8 w-8 text-purple-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Articles</p>
                <p className="text-2xl font-bold text-orange-600">
                  {awareness.filter(a => a.mediaType === 'ARTICLE').length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {awareness.map((item) => {
            const MediaIcon = getMediaIcon(item.mediaType);
            return (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <MediaIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">
                  {item.content.substring(0, 150)}...
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    item.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleView(item)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={showModal}
          onClose={resetForm}
          title={editingItem ? 'Edit Content' : 'Add New Content'}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brief Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief overview of the content (displayed in cards)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Comprehensive details about the content"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="EDUCATION">Education</option>
                  <option value="HEALTH">Health</option>
                  <option value="FINANCE">Finance</option>
                  <option value="TECHNOLOGY">Technology</option>
                  <option value="GOVERNMENT">Government Schemes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Media Type
                </label>
                <select
                  value={formData.mediaType}
                  onChange={(e) => setFormData({...formData, mediaType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ARTICLE">Article</option>
                  <option value="VIDEO">Video</option>
                  <option value="PDF">PDF Document</option>
                  <option value="INFOGRAPHIC">Infographic</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <select
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High Priority</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>

            {/* PDF Upload */}
            {formData.mediaType === 'PDF' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload PDF Document
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.pdfFile && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {formData.pdfFile.name} uploaded successfully
                  </p>
                )}
              </div>
            )}

            {/* Video URL */}
            {formData.mediaType === 'VIDEO' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            )}

            {/* Image URL */}
            {formData.mediaType === 'INFOGRAPHIC' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Comma-separated tags (e.g., dbt, banking, digital)"
              />
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active (visible to users)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                  Featured Content
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editingItem ? 'Update Content' : 'Create Content'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* View Modal */}
        <Modal
          isOpen={!!viewingItem}
          onClose={() => setViewingItem(null)}
          title="Content Details"
        >
          {viewingItem && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {viewingItem.title}
                </h3>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(viewingItem.category)}`}>
                    {viewingItem.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    Type: {viewingItem.mediaType}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-gray-700 whitespace-pre-line">{viewingItem.content}</p>
              </div>

              <div className="text-sm text-gray-500 pt-4 border-t">
                <p>Created: {formatDate(viewingItem.createdAt)}</p>
                <p>Updated: {formatDate(viewingItem.updatedAt)}</p>
                <p>Status: {viewingItem.isActive ? 'Active' : 'Inactive'}</p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
    </ErrorBoundary>
  );
};

export default AwarenessManagement;