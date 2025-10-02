import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { School, Calendar, Users, Upload, Download, Eye, Plus, Filter, Search, Clock, MapPin, FileText, Video, Image, Bell, Star, Share2, MessageCircle, ThumbsUp, BookOpen, Award, CheckCircle, AlertCircle, UserCheck, Camera, Mic, Send, CreditCard as Edit, Trash2, ExternalLink, Target, TrendingUp, BarChart3 } from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';

const SchoolActivities = () => {
  const { t } = useTranslation();
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [userRole, setUserRole] = useState('student');
  const [filters, setFilters] = useState({
    school: '',
    type: '',
    status: '',
    search: ''
  });
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    type: 'workshop',
    date: '',
    time: '',
    venue: '',
    maxAttendees: '',
    targetAudience: 'students',
    objectives: '',
    agenda: '',
    resources: []
  });
  const [feedback, setFeedback] = useState({
    rating: 5,
    comment: '',
    suggestions: ''
  });

  useEffect(() => {
    const mockActivities = [
      {
        id: 1,
        title: 'DBT Awareness Workshop for Parents',
        description: 'Interactive session explaining the importance of Aadhaar seeding for scholarship benefits.',
        type: 'workshop',
        school: 'Government High School, Delhi',
        date: '2024-01-28',
        time: '2:00 PM - 4:00 PM',
        venue: 'School Auditorium',
        organizer: 'Parent-Teacher Committee',
        targetAudience: 'parents',
        attendees: 45,
        maxAttendees: 60,
        registeredUsers: ['user1', 'user2', 'user3'],
        objectives: [
          'Understand the importance of DBT for scholarships',
          'Learn how to check Aadhaar seeding status',
          'Know the steps to enable DBT in bank accounts'
        ],
        agenda: [
          { time: '2:00 PM', topic: 'Welcome & Introduction' },
          { time: '2:15 PM', topic: 'What is DBT and why it matters' },
          { time: '2:45 PM', topic: 'Aadhaar seeding process demonstration' },
          { time: '3:15 PM', topic: 'Q&A Session' },
          { time: '3:45 PM', topic: 'Next steps and resources' }
        ],
        resources: [
          { name: 'DBT Guide.pdf', type: 'pdf', size: '2.5 MB' },
          { name: 'Workshop Recording', type: 'video', size: '45 MB' },
          { name: 'Aadhaar Seeding Checklist', type: 'pdf', size: '1.2 MB' }
        ],
        status: 'upcoming',
        priority: 'high',
        tags: ['DBT', 'Aadhaar', 'Parents', 'Scholarships'],
        feedback: [
          { user: 'Parent A', rating: 5, comment: 'Very informative session!' },
          { user: 'Parent B', rating: 4, comment: 'Good content, could use more examples' }
        ],
        averageRating: 4.5,
        photos: ['photo1.jpg', 'photo2.jpg'],
        liveStream: null,
        recordingUrl: 'https://example.com/recording1',
        createdAt: '2024-01-20',
        updatedAt: '2024-01-22'
      }
    ];
    setActivities(mockActivities);
    setFilteredActivities(mockActivities);
  }, []);

  useEffect(() => {
    let filtered = activities;

    if (filters.search) {
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        activity.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        activity.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    if (filters.school) {
      filtered = filtered.filter(activity => 
        activity.school.toLowerCase().includes(filters.school.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter(activity => activity.type === filters.type);
    }

    if (filters.status) {
      filtered = filtered.filter(activity => activity.status === filters.status);
    }

    setFilteredActivities(filtered);
  }, [filters, activities]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'live': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500';
      case 'medium': return 'border-yellow-500';
      case 'low': return 'border-green-500';
      default: return 'border-gray-300';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'workshop': return School;
      case 'meeting': return Users;
      case 'awareness': return FileText;
      case 'training': return BookOpen;
      default: return Calendar;
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'video': return Video;
      case 'image': return Image;
      default: return FileText;
    }
  };

  const handleRegister = (activityId) => {
    setActivities(prev => prev.map(activity => 
      activity.id === activityId 
        ? { ...activity, registeredUsers: [...activity.registeredUsers, 'currentUser'] }
        : activity
    ));
  };

  const handleAddActivity = () => {
    try {
      if (!newActivity.title?.trim() || !newActivity.description?.trim()) {
        alert('Title and description are required');
        return;
      }
      
      const activity = {
        id: Date.now(),
        ...newActivity,
        organizer: 'Current User',
        attendees: 0,
        registeredUsers: [],
        status: 'upcoming',
        priority: 'medium',
        tags: newActivity.type === 'workshop' ? ['Workshop', 'DBT'] : ['Meeting'],
        feedback: [],
        averageRating: 0,
        photos: [],
        liveStream: null,
        recordingUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setActivities(prev => [activity, ...prev]);
      setNewActivity({
        title: '',
        description: '',
        type: 'workshop',
        date: '',
        time: '',
        venue: '',
        maxAttendees: '',
        targetAudience: 'students',
        objectives: '',
        agenda: '',
        resources: []
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding activity:', error);
      alert('Failed to add activity. Please try again.');
    }
  };

  const handleSubmitFeedback = () => {
    try {
      if (!selectedActivity) {
        alert('No activity selected. Please try again.');
        return;
      }
      
      if (!feedback.comment?.trim()) {
        alert('Please provide a comment before submitting.');
        return;
      }
      
      const newFeedbackItem = {
        user: 'Current User',
        rating: feedback.rating,
        comment: feedback.comment,
        suggestions: feedback.suggestions,
        date: new Date().toISOString()
      };
      
      setActivities(prev => prev.map(activity => 
        activity.id === selectedActivity.id 
          ? { 
              ...activity, 
              feedback: [...(activity.feedback || []), newFeedbackItem],
              averageRating: (((activity.averageRating || 0) * (activity.feedback?.length || 0)) + feedback.rating) / ((activity.feedback?.length || 0) + 1)
            }
          : activity
      ));
      
      setFeedback({ rating: 5, comment: '', suggestions: '' });
      setShowFeedbackModal(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('schoolActivities.title', 'School Awareness Activities')}
            </h1>
            <p className="text-xl text-gray-600">
              {t('schoolActivities.subtitle', 'Participate in DBT awareness events and access educational resources')}
            </p>
            
            <div className="flex space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">{activities.filter(a => a.status === 'upcoming').length} {t('common.upcoming', 'Upcoming')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">{activities.filter(a => a.status === 'completed').length} {t('common.completed', 'Completed')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-gray-600">{activities.reduce((sum, a) => sum + a.attendees, 0)} {t('common.totalParticipants', 'Total Participants')}</span>
              </div>
            </div>
          </div>
          {userRole === 'school_committee' && (
            <Button onClick={() => setShowAddModal(true)} icon={Plus}>
              {t('common.addActivity', 'Add Activity')}
            </Button>
          )}
        </div>

        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.searchActivities', 'Search Activities')}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('common.searchPlaceholder', 'Search activities, tags...')}
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.school', 'School')}
              </label>
              <input
                type="text"
                placeholder={t('common.filterBySchool', 'Filter by school...')}
                value={filters.school}
                onChange={(e) => setFilters(prev => ({ ...prev, school: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
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
                <option value="workshop">{t('common.workshops', 'Workshops')}</option>
                <option value="meeting">{t('common.meetings', 'Meetings')}</option>
                <option value="awareness">{t('common.awareness', 'Awareness')}</option>
                <option value="training">{t('common.training', 'Training')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.status', 'Status')}
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{t('common.allStatus', 'All Status')}</option>
                <option value="upcoming">{t('common.upcoming', 'Upcoming')}</option>
                <option value="completed">{t('common.completed', 'Completed')}</option>
                <option value="live">{t('common.live', 'Live')}</option>
                <option value="cancelled">{t('common.cancelled', 'Cancelled')}</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => setFilters({ school: '', type: '', status: '', search: '' })}
                variant="outline"
                className="w-full"
              >
                {t('common.clearFilters', 'Clear Filters')}
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredActivities.map((activity) => {
            const TypeIcon = getTypeIcon(activity.type);
            return (
              <Card key={activity.id} className={`hover:shadow-lg transition-shadow border-l-4 ${getPriorityColor(activity.priority)}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <TypeIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {activity.school}
                      </p>
                      {activity.averageRating > 0 && (
                        <div className="flex items-center space-x-1 mt-1">
                          {renderStars(activity.averageRating)}
                          <span className="text-sm text-gray-600">({activity.averageRating.toFixed(1)})</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                    {activity.status === 'live' && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-red-600 font-medium">LIVE</span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 mb-4">
                  {activity.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {activity.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(activity.date).toLocaleDateString()} • {activity.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{activity.venue}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{activity.attendees}/{activity.maxAttendees} attendees</span>
                    <div className="w-full bg-gray-200 rounded-full h-2 ml-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(activity.attendees / activity.maxAttendees) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Target className="h-4 w-4" />
                    <span>Target: {activity.targetAudience}</span>
                  </div>
                </div>

                {activity.resources.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Resources ({activity.resources.length}):</h4>
                    <div className="space-y-1">
                      {activity.resources.slice(0, 2).map((resource, index) => {
                        const ResourceIcon = getResourceIcon(resource.type);
                        return (
                          <button
                            key={index}
                            className="flex items-center justify-between w-full p-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                          >
                            <div className="flex items-center space-x-2">
                              <ResourceIcon className="h-4 w-4" />
                              <span>{resource.name}</span>
                              <span className="text-xs text-gray-500">({resource.size})</span>
                            </div>
                            <Download className="h-3 w-3" />
                          </button>
                        );
                      })}
                      {activity.resources.length > 2 && (
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                          +{activity.resources.length - 2} more resources
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>By {activity.organizer}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      icon={Eye}
                      onClick={() => {
                        setSelectedActivity(activity);
                        setShowDetailModal(true);
                      }}
                    >
                      {t('common.details', 'Details')}
                    </Button>
                    {activity.status === 'upcoming' && !activity.registeredUsers.includes('currentUser') && (
                      <Button 
                        size="sm"
                        onClick={() => handleRegister(activity.id)}
                      >
                        {t('common.register', 'Register')}
                      </Button>
                    )}
                    {activity.status === 'upcoming' && activity.registeredUsers.includes('currentUser') && (
                      <Button size="sm" variant="outline" icon={CheckCircle}>
                        {t('common.registered', 'Registered')}
                      </Button>
                    )}
                    {activity.status === 'completed' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        icon={MessageCircle}
                        onClick={() => {
                          setSelectedActivity(activity);
                          setShowFeedbackModal(true);
                        }}
                      >
                        {t('common.feedback', 'Feedback')}
                      </Button>
                    )}
                    <Button size="sm" variant="outline" icon={Share2}>
                      {t('common.share', 'Share')}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredActivities.length === 0 && (
          <Card className="text-center py-12">
            <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('common.noActivitiesFound', 'No activities found')}
            </h3>
            <p className="text-gray-600">
              {t('common.noActivitiesMessage', 'Try adjusting your filters or check back later for new activities.')}
            </p>
          </Card>
        )}

        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title={t('common.createNewActivity', 'Create New Activity')}
          size="lg"
        >
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.activityTitle', 'Activity Title')} *
                </label>
                <input
                  type="text"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('common.enterActivityTitle', 'Enter activity title')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.type', 'Type')} *
                </label>
                <select 
                  value={newActivity.type}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="workshop">{t('common.workshop', 'Workshop')}</option>
                  <option value="meeting">{t('common.meeting', 'Meeting')}</option>
                  <option value="awareness">{t('common.awareness', 'Awareness')}</option>
                  <option value="training">{t('common.training', 'Training')}</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.description', 'Description')} *
              </label>
              <textarea
                rows="3"
                value={newActivity.description}
                onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('common.describeActivity', 'Describe the activity')}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.date', 'Date')} *
                </label>
                <input
                  type="date"
                  value={newActivity.date}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.time', 'Time')} *
                </label>
                <input
                  type="text"
                  value={newActivity.time}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, time: e.target.value }))}
                  placeholder="2:00 PM - 4:00 PM"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.maxAttendees', 'Max Attendees')}
                </label>
                <input
                  type="number"
                  value={newActivity.maxAttendees}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, maxAttendees: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.venue', 'Venue')} *
                </label>
                <input
                  type="text"
                  value={newActivity.venue}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, venue: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('common.schoolAuditorium', 'School Auditorium')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.targetAudience', 'Target Audience')}
                </label>
                <select 
                  value={newActivity.targetAudience}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, targetAudience: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="students">{t('common.students', 'Students')}</option>
                  <option value="parents">{t('common.parents', 'Parents')}</option>
                  <option value="both">{t('common.studentsAndParents', 'Students & Parents')}</option>
                  <option value="teachers">{t('common.teachers', 'Teachers')}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.objectives', 'Objectives')}
              </label>
              <textarea
                rows="2"
                value={newActivity.objectives}
                onChange={(e) => setNewActivity(prev => ({ ...prev, objectives: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('common.listObjectives', 'List the main objectives of this activity')}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button onClick={handleAddActivity}>
                {t('common.createActivity', 'Create Activity')}
              </Button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={selectedActivity?.title}
          size="xl"
        >
          {selectedActivity && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('common.eventDetails', 'Event Details')}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{new Date(selectedActivity.date).toLocaleDateString()} • {selectedActivity.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{selectedActivity.venue}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{selectedActivity.attendees}/{selectedActivity.maxAttendees} attendees</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-gray-500" />
                      <span>Target: {selectedActivity.targetAudience}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('common.organizer', 'Organizer')}</h4>
                  <p className="text-sm text-gray-600">{selectedActivity.organizer}</p>
                  <p className="text-sm text-gray-600">{selectedActivity.school}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{t('common.description', 'Description')}</h4>
                <p className="text-gray-700">{selectedActivity.description}</p>
              </div>

              {selectedActivity.objectives.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('common.objectives', 'Objectives')}</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {selectedActivity.objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedActivity.agenda.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('common.agenda', 'Agenda')}</h4>
                  <div className="space-y-2">
                    {selectedActivity.agenda.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium text-blue-600">{item.time}</span>
                        <span className="text-sm text-gray-700">{item.topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedActivity.feedback.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('common.feedback', 'Feedback')}</h4>
                  <div className="space-y-3">
                    {selectedActivity.feedback.map((fb, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{fb.user}</span>
                          <div className="flex items-center space-x-1">
                            {renderStars(fb.rating)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{fb.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>

        <Modal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          title={t('common.shareYourFeedback', 'Share Your Feedback')}
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.rating', 'Rating')}
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => {
                      try {
                        setFeedback(prev => ({ ...prev, rating: star }));
                      } catch (error) {
                        console.error('Error updating rating:', error);
                      }
                    }}
                    className="focus:outline-none hover:scale-110 transition-transform"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.comment', 'Comment')}
              </label>
              <textarea
                rows="3"
                value={feedback.comment}
                onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('common.shareExperience', 'Share your experience...')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.suggestionsForImprovement', 'Suggestions for Improvement')}
              </label>
              <textarea
                rows="2"
                value={feedback.suggestions}
                onChange={(e) => setFeedback(prev => ({ ...prev, suggestions: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('common.suggestionsPlaceholder', 'Any suggestions for future activities?')}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setShowFeedbackModal(false)}>
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button 
                onClick={() => {
                  try {
                    if (!feedback.comment?.trim()) {
                      alert('Please provide a comment before submitting.');
                      return;
                    }
                    handleSubmitFeedback();
                  } catch (error) {
                    console.error('Error submitting feedback:', error);
                    alert('Failed to submit feedback. Please try again.');
                  }
                }} 
                icon={Send}
              >
                {t('common.submitFeedback', 'Submit Feedback')}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default SchoolActivities;