import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Megaphone, Calendar, MapPin, Filter, Search, Bell, Download, Eye, Clock, AlertTriangle, CheckCircle, Star, Share2, Bookmark, BookmarkCheck, ThumbsUp, MessageCircle, Users, Phone, Mail, ExternalLink, Image, FileText, Video, Plus, CreditCard as Edit, Trash2, Send, Flag, TrendingUp, Target, Award, Zap, RefreshCw } from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { DISTRICTS } from '../../utils/constants';
import communityActionService from '../../services/communityActionService';
import noticeService from '../../services/noticeService';

const CommunityEvents = () => {
  const { t } = useTranslation();
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [userRole, setUserRole] = useState('citizen');
  const [bookmarkedNotices, setBookmarkedNotices] = useState([]);
  const [filters, setFilters] = useState({
    district: '',
    type: '',
    priority: '',
    search: '',
    dateRange: 'all'
  });
  const [newNotice, setNewNotice] = useState({
    title: '',
    description: '',
    type: 'announcement',
    priority: 'medium',
    district: '',
    panchayat: '',
    venue: '',
    date: '',
    time: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    targetAudience: 'all',
    tags: '',
    attachments: []
  });

  useEffect(() => {
    loadNoticesFromStorage();
  }, []);

  const loadNoticesFromStorage = () => {
    // Load from admin notices first
    const adminNotices = noticeService.getNoticesFromStorage();
    const convertedNotices = noticeService.convertToCommunitFormat(adminNotices);
    
    // Also load community actions
    const actions = communityActionService.initializeDummyData();
    const communityNotices = actions
      .filter(action => action.isActive)
      .map(action => ({
        id: `community_${action.id}`,
        title: action.title,
        description: action.description,
        type: action.actionType.toLowerCase().replace('_', ' '),
        priority: action.isFeatured ? 'high' : 'medium',
        district: action.district || 'All Districts',
        panchayat: action.panchayat || `${action.district || 'All'} Panchayat`,
        date: action.actionDate ? action.actionDate.split('T')[0] : '',
        time: action.actionDate ? new Date(action.actionDate).toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : '',
        venue: action.venue || 'Community Center',
        contactPerson: action.contactPerson || 'Panchayat Officer',
        contactPhone: action.contactPhone || '+91-9876543210',
        contactEmail: action.contactEmail || 'info@panchayat.gov.in',
        targetAudience: action.targetAudience.toLowerCase(),
        tags: [action.actionType.replace('_', ' '), 'Community Action', 'Government'],
        attachments: [],
        views: Math.floor(Math.random() * 500) + 100,
        likes: Math.floor(Math.random() * 100) + 20,
        bookmarks: Math.floor(Math.random() * 200) + 50,
        comments: [
          { 
            user: 'Community Member', 
            comment: 'Great initiative!', 
            date: new Date().toISOString().split('T')[0] 
          }
        ],
        status: 'active',
        featured: action.isFeatured,
        createdAt: action.createdAt,
        updatedAt: action.updatedAt,
        author: 'Community Administration',
        authorRole: 'government_official',
        maxParticipants: action.maxParticipants,
        currentParticipants: action.currentParticipants,
        registrationRequired: action.registrationRequired,
        durationHours: action.durationHours
      }));
    
    // Combine both admin notices and community actions
    const allNotices = [...convertedNotices, ...communityNotices];
    console.log('Loaded community notices:', allNotices);
    setNotices(allNotices);
    setFilteredNotices(allNotices);
  };

  useEffect(() => {
    let filtered = notices;
    if (filters.search) {
      filtered = filtered.filter(notice =>
        notice.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        notice.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        notice.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }
    if (filters.district) {
      filtered = filtered.filter(notice => notice.district === filters.district);
    }
    if (filters.type) {
      filtered = filtered.filter(notice => notice.type === filters.type);
    }
    if (filters.priority) {
      filtered = filtered.filter(notice => notice.priority === filters.priority);
    }
    filtered.sort((a, b) => {
      const priorityOrder = { urgent: 3, high: 2, medium: 1, low: 0 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    setFilteredNotices(filtered);
  }, [filters, notices]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-blue-500 bg-blue-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'camp': return Calendar;
      case 'workshop': return Bell;
      case 'announcement': return Megaphone;
      case 'verification': return Eye;
      case 'program': return Award;
      default: return Bell;
    }
  };

  const handleBookmark = (noticeId) => {
    const isCurrentlyBookmarked = bookmarkedNotices.includes(noticeId);
    setBookmarkedNotices(prev => 
      isCurrentlyBookmarked 
        ? prev.filter(id => id !== noticeId)
        : [...prev, noticeId]
    );
    setNotices(prev => prev.map(notice => 
      notice.id === noticeId 
        ? { 
            ...notice, 
            bookmarks: isCurrentlyBookmarked 
              ? notice.bookmarks - 1 
              : notice.bookmarks + 1 
          }
        : notice
    ));
  };

  const handleLike = (noticeId) => {
    setNotices(prev => prev.map(notice => 
      notice.id === noticeId 
        ? { ...notice, likes: notice.likes + 1 }
        : notice
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Community Events
            </h1>
            <p className="text-xl text-gray-600">
              Stay updated with latest announcements from your Gram Panchayat
            </p>
          </div>
          <Button 
            onClick={loadNoticesFromStorage}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>

        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Notices
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notices, tags..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
              <select
                value={filters.district}
                onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Districts</option>
                {DISTRICTS.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => setFilters({ district: '', type: '', priority: '', search: '', dateRange: 'all' })}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredNotices.map((notice) => {
            const TypeIcon = getTypeIcon(notice.type);
            const isBookmarked = bookmarkedNotices.includes(notice.id);
            
            return (
              <Card key={notice.id} className={`border-l-4 ${getPriorityColor(notice.priority)} hover:shadow-lg transition-shadow`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <TypeIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {notice.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {notice.panchayat} • {getTimeAgo(notice.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{notice.description}</p>
                <div className="space-y-2 mb-4">
                  {notice.date && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(notice.date)}</span>
                      {notice.time && <span>• {notice.time}</span>}
                    </div>
                  )}
                  {notice.venue && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{notice.venue}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => handleLike(notice.id)}
                      className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{notice.likes}</span>
                    </button>
                    <button 
                      onClick={() => handleBookmark(notice.id)}
                      className={`flex items-center space-x-1 text-sm hover:text-blue-600 ${
                        isBookmarked ? 'text-blue-600' : 'text-gray-500'
                      }`}
                    >
                      {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                      <span>{notice.bookmarks}</span>
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommunityEvents;