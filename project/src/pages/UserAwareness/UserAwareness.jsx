import React, { useState, useEffect } from 'react';
import { BookOpen, Video, FileText, Image, Search, Filter, Eye, Clock, Wifi, WifiOff, Download, Play } from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import socketService from '../../services/socketService';

const UserAwareness = () => {
  const [awareness, setAwareness] = useState([]);
  const [filteredAwareness, setFilteredAwareness] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    mediaType: '',
    search: ''
  });

  useEffect(() => {
    loadAwarenessContent();
    
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
    
    // Listen for real-time content updates
    const handleContentUpdate = (event) => {
      console.log('📚 Content update received:', event.detail);
      loadAwarenessContent();
      setLastUpdate(new Date());
      
      // Show notification
      if (event.detail.type === 'CONTENT_CREATED') {
        showNotification('New content available!', 'success');
      } else if (event.detail.type === 'CONTENT_UPDATED') {
        showNotification('Content has been updated!', 'info');
      }
    };
    
    window.addEventListener('contentUpdate', handleContentUpdate);
    
    // Check connection status periodically
    const statusInterval = setInterval(() => {
      setIsConnected(socketService.isConnected());
    }, 3000);
    
    // Fallback polling for offline mode
    const pollInterval = setInterval(() => {
      if (!socketService.isConnected()) {
        loadAwarenessContent();
        setLastUpdate(new Date());
      }
    }, 10000);
    
    return () => {
      window.removeEventListener('contentUpdate', handleContentUpdate);
      clearInterval(statusInterval);
      clearInterval(pollInterval);
    };
  }, []);

  const loadAwarenessContent = () => {
    try {
      const storedAwareness = JSON.parse(localStorage.getItem('awarenessContent') || '[]');
      const activeContent = storedAwareness.filter(content => content.isActive);
      setAwareness(activeContent);
      setFilteredAwareness(activeContent);
      console.log(`📚 Loaded ${activeContent.length} active content items from localStorage`);
    } catch (error) {
      console.error('Error loading awareness content:', error);
      setAwareness([]);
      setFilteredAwareness([]);
    }
  };
  
  const showNotification = (message, type = 'info') => {
    // Simple notification system
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white ${
      type === 'success' ? 'bg-green-500' : 
      type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  useEffect(() => {
    let filtered = awareness;
    
    if (filters.search) {
      filtered = filtered.filter(content =>
        content.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        content.content.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.category) {
      filtered = filtered.filter(content => content.category === filters.category);
    }
    
    if (filters.mediaType) {
      filtered = filtered.filter(content => content.mediaType === filters.mediaType);
    }
    
    setFilteredAwareness(filtered);
  }, [filters, awareness]);

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
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleView = (content) => {
    setSelectedContent(content);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Awareness Center
            </h1>
            <p className="text-xl text-gray-600">
              ({awareness.length} items)
            </p>
          </div>
          <Button onClick={loadAwarenessContent} variant="outline">
            Refresh Content
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Content
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search awareness content..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                <option value="EDUCATION">Education</option>
                <option value="HEALTH">Health</option>
                <option value="FINANCE">Finance</option>
                <option value="TECHNOLOGY">Technology</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
              <select
                value={filters.mediaType}
                onChange={(e) => setFilters(prev => ({ ...prev, mediaType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="ARTICLE">Articles</option>
                <option value="VIDEO">Videos</option>
                <option value="INFOGRAPHIC">Infographics</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={() => setFilters({ category: '', mediaType: '', search: '' })}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAwareness.map((content) => {
            const MediaIcon = getMediaIcon(content.mediaType);
            return (
              <Card key={content.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleView(content)}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <MediaIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {content.title}
                      </h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(content.category)}`}>
                        {content.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {content.content.substring(0, 150)}...
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(content.createdAt)}</span>
                  </div>
                  <div className="flex space-x-2">
                    {content.mediaType === 'PDF' && content.pdfUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          const link = document.createElement('a');
                          link.href = content.pdfUrl;
                          link.download = `${content.title}.pdf`;
                          link.click();
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                    )}
                    {content.mediaType === 'VIDEO' && content.videoUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(content.videoUrl, '_blank');
                        }}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Watch
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      Read More
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>



        {/* Content Detail Modal */}
        <Modal
          isOpen={!!selectedContent}
          onClose={() => setSelectedContent(null)}
          title="Awareness Content"
        >
          {selectedContent && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {selectedContent.title}
                </h3>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(selectedContent.category)}`}>
                    {selectedContent.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {selectedContent.mediaType}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(selectedContent.createdAt)}
                  </span>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {selectedContent.content}
                </p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default UserAwareness;