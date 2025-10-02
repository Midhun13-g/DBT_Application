import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Megaphone, Calendar, MapPin, Filter, Search, Bell, Download, Eye, Clock, AlertTriangle, CheckCircle, Star, Share2, Bookmark, BookmarkCheck, ThumbsUp, MessageCircle, Users, Phone, Mail, ExternalLink, Image, FileText, Video, Plus, CreditCard as Edit, Trash2, Send, Flag, TrendingUp, Target, Award, Zap } from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { DISTRICTS } from '../../utils/constants';

const NoticeBoard = () => {
  const { t } = useTranslation();
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [userRole, setUserRole] = useState('citizen'); // citizen, panchayat_official, admin
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

  // Mock notices data with enhanced features
  useEffect(() => {
    const mockNotices = [
      {
        id: 1,
        title: 'Aadhaar Seeding Camp - Delhi Central',
        description: 'Free Aadhaar seeding camp for all bank account holders. Bring your Aadhaar card and bank passbook. Expert assistance available for all major banks.',
        type: 'camp',
        priority: 'high',
        district: 'Delhi',
        panchayat: 'Central Delhi Panchayat',
        date: '2024-01-25',
        time: '10:00 AM - 4:00 PM',
        venue: 'Community Center, Connaught Place',
        contactPerson: 'Rajesh Kumar',
        contactPhone: '+91-9876543210',
        contactEmail: 'rajesh@delhipanchayat.gov.in',
        targetAudience: 'all',
        tags: ['Aadhaar', 'Banking', 'DBT', 'Free Service'],
        attachments: [
          { name: 'camp-poster.pdf', type: 'pdf', size: '2.1 MB' },
          { name: 'required-documents.pdf', type: 'pdf', size: '1.5 MB' }
        ],
        views: 1250,
        likes: 89,
        bookmarks: 156,
        comments: [
          { user: 'Priya Sharma', comment: 'Very helpful! Will definitely attend.', date: '2024-01-21' },
          { user: 'Amit Singh', comment: 'What documents are required?', date: '2024-01-22' }
        ],
        status: 'active',
        featured: true,
        createdAt: '2024-01-20',
        updatedAt: '2024-01-22',
        author: 'Delhi Panchayat Office',
        authorRole: 'panchayat_official'
      },
      {
        id: 2,
        title: 'Scholarship Application Deadline Extended',
        description: 'The deadline for DBT scholarship applications has been extended till 31st March 2024. Students who haven\'t applied yet can still submit their applications.',
        type: 'announcement',
        priority: 'urgent',
        district: 'Mumbai',
        panchayat: 'Mumbai West Panchayat',
        date: '2024-03-31',
        time: 'All Day',
        venue: 'Online Portal',
        contactPerson: 'Dr. Sunita Patel',
        contactPhone: '+91-9876543211',
        contactEmail: 'sunita@mumbaiwest.gov.in',
        targetAudience: 'students',
        tags: ['Scholarship', 'Deadline', 'Students', 'DBT'],
        attachments: [
          { name: 'scholarship-guidelines.pdf', type: 'pdf', size: '3.2 MB' },
          { name: 'application-form.pdf', type: 'pdf', size: '1.8 MB' }
        ],
        views: 2340,
        likes: 234,
        bookmarks: 445,
        comments: [
          { user: 'Student A', comment: 'Thank you for the extension!', date: '2024-01-19' },
          { user: 'Parent B', comment: 'How to check application status?', date: '2024-01-20' }
        ],
        status: 'active',
        featured: true,
        createdAt: '2024-01-18',
        updatedAt: '2024-01-20',
        author: 'Mumbai Education Department',
        authorRole: 'admin'
      }
    ];
    setNotices(mockNotices);
    setFilteredNotices(mockNotices);
  }, []);

  // Filter notices based on search and filters
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

    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(notice => new Date(notice.date) >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() + 7);
          filtered = filtered.filter(notice => new Date(notice.date) <= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() + 1);
          filtered = filtered.filter(notice => new Date(notice.date) <= filterDate);
          break;
        default:
          break;
      }
    }

    // Sort by priority and date
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

  const getPriorityBadge = (priority) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-blue-100 text-blue-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
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

  const handleAddNotice = () => {
    const notice = {
      id: Date.now(),
      ...newNotice,
      tags: newNotice.tags.split(',').map(tag => tag.trim()),
      views: 0,
      likes: 0,
      bookmarks: 0,
      comments: [],
      status: 'active',
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: 'Current User',
      authorRole: userRole
    };
    
    setNotices(prev => [notice, ...prev]);
    setNewNotice({
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
    setShowAddModal(false);
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
        {/* Enhanced Header with Statistics */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('noticeBoard.title', 'Community Notice Board')}
            </h1>
            <p className="text-xl text-gray-600">
              {t('noticeBoard.subtitle', 'Stay updated with latest announcements from your Gram Panchayat')}
            </p>
            
            {/* Quick Stats */}
            <div className="flex space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-sm text-gray-600">{notices.filter(n => n.priority === 'urgent').length} {t('common.urgent', 'Urgent')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-600" />
                <span className="text-sm text-gray-600">{notices.filter(n => n.featured).length} {t('common.featured', 'Featured')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">{notices.reduce((sum, n) => sum + n.views, 0)} {t('common.totalViews', 'Total Views')}</span>
              </div>
            </div>
          </div>
          {userRole === 'panchayat_official' && (
            <Button onClick={() => setShowAddModal(true)} icon={Plus}>
              {t('common.addNotice', 'Add Notice')}
            </Button>
          )}
        </div>

        {/* Enhanced Filters */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.searchNotices', 'Search Notices')}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('common.searchPlaceholder', 'Search notices, tags...')}
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.district', 'District')}
              </label>
              <select
                value={filters.district}
                onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{t('common.allDistricts', 'All Districts')}</option>
                {DISTRICTS.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.type', 'Type')}
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{t('common.allTypes', 'All Types')}</option>
                <option value="camp">{t('common.camps', 'Camps')}</option>
                <option value="workshop">{t('common.workshops', 'Workshops')}</option>
                <option value="announcement">{t('common.announcements', 'Announcements')}</option>
                <option value="verification">{t('common.verification', 'Verification')}</option>
                <option value="program">{t('common.programs', 'Programs')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.priority', 'Priority')}
              </label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{t('common.allPriorities', 'All Priorities')}</option>
                <option value="urgent">{t('common.urgent', 'Urgent')}</option>
                <option value="high">{t('common.high', 'High')}</option>
                <option value="medium">{t('common.medium', 'Medium')}</option>
                <option value="low">{t('common.low', 'Low')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.dateRange', 'Date Range')}
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">{t('common.allTime', 'All Time')}</option>
                <option value="today">{t('common.today', 'Today')}</option>
                <option value="week">{t('common.thisWeek', 'This Week')}</option>
                <option value="month">{t('common.thisMonth', 'This Month')}</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => setFilters({ district: '', type: '', priority: '', search: '', dateRange: 'all' })}
                variant="outline"
                className="w-full"
              >
                {t('common.clearFilters', 'Clear Filters')}
              </Button>
            </div>
          </div>
        </Card>

        {/* All Notices Grid */}
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
                  <div className="flex items-center space-x-2">
                    {notice.priority === 'urgent' && (
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                        {t('common.urgent', 'Urgent')}
                      </span>
                    )}
                    {notice.featured && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                </div>

                <p className="text-gray-700 mb-4">
                  {notice.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {notice.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                  {notice.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{notice.tags.length - 3} more
                    </span>
                  )}
                </div>

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
                  {notice.contactPerson && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{notice.contactPerson} - {notice.contactPhone}</span>
                    </div>
                  )}
                </div>

                {notice.attachments && notice.attachments.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">{t('common.attachments', 'Attachments')}:</h4>
                    <div className="space-y-1">
                      {notice.attachments.map((attachment, index) => (
                        <button
                          key={index}
                          className="flex items-center justify-between w-full p-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                        >
                          <div className="flex items-center space-x-2">
                            <Download className="h-4 w-4" />
                            <span>{attachment.name}</span>
                            <span className="text-xs text-gray-500">({attachment.size})</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

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
                    <span className="flex items-center space-x-1 text-sm text-gray-500">
                      <MessageCircle className="h-4 w-4" />
                      <span>{notice.comments.length}</span>
                    </span>
                    <span className="flex items-center space-x-1 text-sm text-gray-500">
                      <Eye className="h-4 w-4" />
                      <span>{notice.views}</span>
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedNotice(notice);
                        setShowDetailModal(true);
                      }}
                    >
                      {t('common.viewDetails', 'View Details')}
                    </Button>
                    <Button size="sm" variant="outline" icon={Share2}>
                      {t('common.share', 'Share')}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredNotices.length === 0 && (
          <Card className="text-center py-12">
            <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('common.noNoticesFound', 'No notices found')}
            </h3>
            <p className="text-gray-600">
              {t('common.noNoticesMessage', 'Try adjusting your filters or check back later for new announcements.')}
            </p>
          </Card>
        )}

        {/* Enhanced Add Notice Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title={t('common.createNewNotice', 'Create New Notice')}
          size="xl"
        >
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.noticeTitle', 'Notice Title')} *
                </label>
                <input
                  type="text"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('common.enterNoticeTitle', 'Enter notice title')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.type', 'Type')} *
                </label>
                <select 
                  value={newNotice.type}
                  onChange={(e) => setNewNotice(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="announcement">{t('common.announcement', 'Announcement')}</option>
                  <option value="camp">{t('common.camp', 'Camp')}</option>
                  <option value="workshop">{t('common.workshop', 'Workshop')}</option>
                  <option value="verification">{t('common.verification', 'Verification')}</option>
                  <option value="program">{t('common.program', 'Program')}</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.description', 'Description')} *
              </label>
              <textarea
                rows="4"
                value={newNotice.description}
                onChange={(e) => setNewNotice(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('common.describeNotice', 'Describe the notice in detail')}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.priority', 'Priority')}
                </label>
                <select 
                  value={newNotice.priority}
                  onChange={(e) => setNewNotice(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">{t('common.low', 'Low')}</option>
                  <option value="medium">{t('common.medium', 'Medium')}</option>
                  <option value="high">{t('common.high', 'High')}</option>
                  <option value="urgent">{t('common.urgent', 'Urgent')}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.district', 'District')} *
                </label>
                <select 
                  value={newNotice.district}
                  onChange={(e) => setNewNotice(prev => ({ ...prev, district: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t('common.selectDistrict', 'Select District')}</option>
                  {DISTRICTS.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.targetAudience', 'Target Audience')}
                </label>
                <select 
                  value={newNotice.targetAudience}
                  onChange={(e) => setNewNotice(prev => ({ ...prev, targetAudience: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">{t('common.allCitizens', 'All Citizens')}</option>
                  <option value="students">{t('common.students', 'Students')}</option>
                  <option value="parents">{t('common.parents', 'Parents')}</option>
                  <option value="elderly">{t('common.elderly', 'Elderly')}</option>
                  <option value="women">{t('common.women', 'Women')}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.date', 'Date')}
                </label>
                <input
                  type="date"
                  value={newNotice.date}
                  onChange={(e) => setNewNotice(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.time', 'Time')}
                </label>
                <input
                  type="text"
                  value={newNotice.time}
                  onChange={(e) => setNewNotice(prev => ({ ...prev, time: e.target.value }))}
                  placeholder="10:00 AM - 4:00 PM"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.venue', 'Venue')}
              </label>
              <input
                type="text"
                value={newNotice.venue}
                onChange={(e) => setNewNotice(prev => ({ ...prev, venue: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('common.communityCenter', 'Community Center, Main Hall')}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.contactPerson', 'Contact Person')}
                </label>
                <input
                  type="text"
                  value={newNotice.contactPerson}
                  onChange={(e) => setNewNotice(prev => ({ ...prev, contactPerson: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('common.contactPersonName', 'Contact person name')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.phone', 'Phone')}
                </label>
                <input
                  type="tel"
                  value={newNotice.contactPhone}
                  onChange={(e) => setNewNotice(prev => ({ ...prev, contactPhone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+91-9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.email', 'Email')}
                </label>
                <input
                  type="email"
                  value={newNotice.contactEmail}
                  onChange={(e) => setNewNotice(prev => ({ ...prev, contactEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="contact@panchayat.gov.in"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.tags', 'Tags')} ({t('common.commaSeparated', 'comma separated')})
              </label>
              <input
                type="text"
                value={newNotice.tags}
                onChange={(e) => setNewNotice(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="DBT, Aadhaar, Scholarship, Banking"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button onClick={handleAddNotice}>
                {t('common.publishNotice', 'Publish Notice')}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Notice Detail Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={selectedNotice?.title}
          size="xl"
        >
          {selectedNotice && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadge(selectedNotice.priority)}`}>
                    {selectedNotice.priority.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {selectedNotice.type.charAt(0).toUpperCase() + selectedNotice.type.slice(1)}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{selectedNotice.views} views</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{selectedNotice.likes} likes</span>
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{t('common.description', 'Description')}</h4>
                <p className="text-gray-700">{selectedNotice.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('common.eventDetails', 'Event Details')}</h4>
                  <div className="space-y-2 text-sm">
                    {selectedNotice.date && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{formatDate(selectedNotice.date)} • {selectedNotice.time}</span>
                      </div>
                    )}
                    {selectedNotice.venue && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{selectedNotice.venue}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>Target: {selectedNotice.targetAudience}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('common.contactInformation', 'Contact Information')}</h4>
                  <div className="space-y-2 text-sm">
                    {selectedNotice.contactPerson && (
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{selectedNotice.contactPerson}</span>
                      </div>
                    )}
                    {selectedNotice.contactPhone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{selectedNotice.contactPhone}</span>
                      </div>
                    )}
                    {selectedNotice.contactEmail && (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{selectedNotice.contactEmail}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedNotice.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('common.tags', 'Tags')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNotice.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedNotice.comments.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('common.comments', 'Comments')} ({selectedNotice.comments.length})</h4>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {selectedNotice.comments.map((comment, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{comment.user}</span>
                          <span className="text-xs text-gray-500">{getTimeAgo(comment.date)}</span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default NoticeBoard;