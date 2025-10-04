import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, School, Calendar, Users, Clock, MapPin, FileText, Video, Image, CheckCircle, Wifi, WifiOff, Star, Target, BookOpen } from 'lucide-react';
import Card from '../../../components/Card/Card';
import Button from '../../../components/Button/Button';
import Modal from '../../../components/Modal/Modal';
import ErrorBoundary from '../../../components/ErrorBoundary/ErrorBoundary';
import socketService from '../../../services/socketService';
import { useAuth } from '../../../hooks/useAuth';

const SchoolActivitiesManagement = () => {
  const [activities, setActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'workshop',
    school: '',
    date: '',
    time: '',
    venue: '',
    organizer: '',
    targetAudience: 'students',
    maxAttendees: 50,
    objectives: '',
    agenda: '',
    resources: '',
    tags: '',
    priority: 'medium',
    isActive: true
  });
  
  const { user } = useAuth();

  useEffect(() => {
    loadActivities();
    
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

  const loadActivities = () => {
    try {
      const stored = localStorage.getItem('schoolActivities');
      if (!stored) {
        const dummyActivities = [
          {
            id: 1,
            title: 'DBT Awareness Workshop for Parents',
            description: 'Interactive session explaining the importance of Aadhaar seeding for scholarship benefits.',
            type: 'workshop',
            school: 'Government High School, Delhi',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 2,
            title: 'Student Digital Banking Awareness',
            description: 'Teaching students about safe digital banking practices and scholarship account management.',
            type: 'awareness',
            school: 'Government Senior Secondary School, Mumbai',
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '10:00 AM - 12:00 PM',
            venue: 'Computer Lab',
            organizer: 'IT Department',
            targetAudience: 'students',
            attendees: 30,
            maxAttendees: 40,
            registeredUsers: [],
            objectives: [
              'Learn about digital banking safety',
              'Understand scholarship disbursement process',
              'Know how to track DBT payments'
            ],
            agenda: [
              { time: '10:00 AM', topic: 'Digital Banking Basics' },
              { time: '10:30 AM', topic: 'Scholarship Account Setup' },
              { time: '11:00 AM', topic: 'Safety Tips and Best Practices' },
              { time: '11:30 AM', topic: 'Hands-on Practice Session' }
            ],
            resources: [
              { name: 'Digital Banking Safety Guide.pdf', type: 'pdf', size: '1.8 MB' },
              { name: 'Scholarship Process Flowchart', type: 'image', size: '500 KB' }
            ],
            status: 'upcoming',
            priority: 'medium',
            tags: ['Digital Banking', 'Students', 'Safety', 'Scholarships'],
            feedback: [],
            averageRating: 0,
            photos: [],
            liveStream: null,
            recordingUrl: null,
            isActive: true,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 3,
            title: 'Teacher Training on DBT Monitoring',
            description: 'Training session for teachers to help students with DBT-related queries and scholarship tracking.',
            type: 'training',
            school: 'Government School, Bangalore',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '9:00 AM - 1:00 PM',
            venue: 'Staff Room',
            organizer: 'Education Department',
            targetAudience: 'teachers',
            attendees: 25,
            maxAttendees: 25,
            registeredUsers: [],
            objectives: [
              'Understand DBT system for scholarships',
              'Learn to assist students with queries',
              'Know escalation procedures for issues'
            ],
            agenda: [
              { time: '9:00 AM', topic: 'DBT System Overview' },
              { time: '10:00 AM', topic: 'Common Student Issues' },
              { time: '11:00 AM', topic: 'Resolution Procedures' },
              { time: '12:00 PM', topic: 'Documentation and Reporting' }
            ],
            resources: [
              { name: 'Teacher DBT Handbook.pdf', type: 'pdf', size: '3.2 MB' },
              { name: 'Issue Resolution Flowchart', type: 'image', size: '750 KB' },
              { name: 'Training Video', type: 'video', size: '120 MB' }
            ],
            status: 'completed',
            priority: 'high',
            tags: ['Teacher Training', 'DBT', 'Support', 'Education'],
            feedback: [
              { user: 'Teacher A', rating: 5, comment: 'Excellent training material!' },
              { user: 'Teacher B', rating: 5, comment: 'Very helpful for student support' },
              { user: 'Teacher C', rating: 4, comment: 'Good content, need more practical examples' }
            ],
            averageRating: 4.7,
            photos: ['training1.jpg', 'training2.jpg'],
            liveStream: null,
            recordingUrl: 'https://example.com/teacher-training',
            isActive: true,
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        
        localStorage.setItem('schoolActivities', JSON.stringify(dummyActivities));
        setActivities(dummyActivities);
      } else {
        try {
          const storedActivities = JSON.parse(stored);
          setActivities(storedActivities);
        } catch (error) {
          console.error('Error parsing stored school activities:', error);
          setActivities([]);
        }
      }
    } catch (error) {
      console.error('Error loading school activities:', error);
      setActivities([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!formData.description.trim()) {
      alert('Please enter a description');
      return;
    }
    
    try {
      let schoolActivities = JSON.parse(localStorage.getItem('schoolActivities') || '[]');
      
      if (schoolActivities.length === 0) {
        loadActivities();
        schoolActivities = JSON.parse(localStorage.getItem('schoolActivities') || '[]');
      }
      
      if (editingActivity) {
        const index = schoolActivities.findIndex(a => a.id === editingActivity.id);
        if (index !== -1) {
          schoolActivities[index] = { 
            ...schoolActivities[index], 
            ...formData,
            objectives: formData.objectives ? formData.objectives.split('\n').filter(obj => obj.trim()) : [],
            agenda: formData.agenda ? formData.agenda.split('\n').map(line => {
              const [time, topic] = line.split(' - ');
              return { time: time?.trim(), topic: topic?.trim() };
            }).filter(item => item.time && item.topic) : [],
            tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
            updatedAt: new Date().toISOString() 
          };
        }
      } else {
        const newActivity = {
          ...formData,
          id: Date.now(),
          attendees: 0,
          registeredUsers: [],
          status: 'upcoming',
          feedback: [],
          averageRating: 0,
          photos: [],
          liveStream: null,
          recordingUrl: null,
          objectives: formData.objectives ? formData.objectives.split('\n').filter(obj => obj.trim()) : [],
          agenda: formData.agenda ? formData.agenda.split('\n').map(line => {
            const [time, topic] = line.split(' - ');
            return { time: time?.trim(), topic: topic?.trim() };
          }).filter(item => item.time && item.topic) : [],
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        schoolActivities.unshift(newActivity);
      }
      
      localStorage.setItem('schoolActivities', JSON.stringify(schoolActivities));
      setActivities(schoolActivities);
      
      if (socketService.isConnected()) {
        const updateData = {
          type: editingActivity ? 'SCHOOL_ACTIVITY_UPDATED' : 'SCHOOL_ACTIVITY_CREATED',
          activity: editingActivity ? 
            schoolActivities.find(a => a.id === editingActivity.id) : 
            schoolActivities[0],
          allActivities: schoolActivities,
          timestamp: new Date().toISOString(),
          adminUser: user?.name || 'Admin'
        };
        
        socketService.sendAdminContentUpdate(updateData);
      }
      
      window.dispatchEvent(new CustomEvent('schoolActivityUpdate', {
        detail: {
          type: editingActivity ? 'SCHOOL_ACTIVITY_UPDATED' : 'SCHOOL_ACTIVITY_CREATED',
          activity: editingActivity ? 
            schoolActivities.find(a => a.id === editingActivity.id) : 
            schoolActivities[0],
          timestamp: new Date().toISOString()
        }
      }));
      
      resetForm();
    } catch (error) {
      console.error('Error saving school activity:', error);
      alert('Error saving activity. Please try again.');
    }
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setFormData({
      title: activity.title,
      description: activity.description,
      type: activity.type,
      school: activity.school,
      date: activity.date,
      time: activity.time,
      venue: activity.venue,
      organizer: activity.organizer,
      targetAudience: activity.targetAudience,
      maxAttendees: activity.maxAttendees,
      objectives: activity.objectives ? activity.objectives.join('\n') : '',
      agenda: activity.agenda ? activity.agenda.map(item => `${item.time} - ${item.topic}`).join('\n') : '',
      resources: '',
      tags: activity.tags ? activity.tags.join(', ') : '',
      priority: activity.priority || 'medium',
      isActive: activity.isActive
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        const schoolActivities = JSON.parse(localStorage.getItem('schoolActivities') || '[]');
        const filteredActivities = schoolActivities.filter(a => a.id !== id);
        localStorage.setItem('schoolActivities', JSON.stringify(filteredActivities));
        setActivities(filteredActivities);
        
        // Send real-time update
        if (socketService.isConnected()) {
          socketService.sendAdminContentUpdate({
            type: 'SCHOOL_ACTIVITY_DELETED',
            activityId: id,
            allActivities: filteredActivities,
            timestamp: new Date().toISOString(),
            adminUser: user?.name || 'Admin'
          });
        }
        
        window.dispatchEvent(new CustomEvent('schoolActivityUpdate', {
          detail: {
            type: 'SCHOOL_ACTIVITY_DELETED',
            activityId: id,
            allActivities: filteredActivities,
            timestamp: new Date().toISOString()
          }
        }));
      } catch (error) {
        console.error('Error deleting activity:', error);
        alert('Error deleting activity. Please try again.');
      }
    }
  };

  const handleView = (activity) => {
    setSelectedActivity(activity);
    setShowDetailModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'workshop',
      school: '',
      date: '',
      time: '',
      venue: '',
      organizer: '',
      targetAudience: 'students',
      maxAttendees: 50,
      objectives: '',
      agenda: '',
      resources: '',
      tags: '',
      priority: 'medium',
      isActive: true
    });
    setEditingActivity(null);
    setShowModal(false);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'workshop': return 'bg-blue-100 text-blue-800';
      case 'awareness': return 'bg-green-100 text-green-800';
      case 'training': return 'bg-purple-100 text-purple-800';
      case 'meeting': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                School Activities Management
              </h1>
              <div className="flex items-center space-x-4">
                <p className="text-gray-600">
                  Create and manage school awareness activities
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
              <span>Add Activity</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Activities</p>
                  <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
                </div>
                <School className="h-8 w-8 text-blue-600" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-green-600">
                    {activities.filter(a => a.status === 'upcoming').length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {activities.filter(a => a.status === 'completed').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Participants</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {activities.reduce((sum, a) => sum + (a.attendees || 0), 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => {
              const TypeIcon = getTypeIcon(activity.type);
              return (
                <Card key={activity.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <TypeIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {activity.title}
                        </h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(activity.type)}`}>
                          {activity.type}
                        </span>
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      activity.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {activity.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {activity.description}
                  </p>

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
                      <span>{activity.attendees || 0}/{activity.maxAttendees} attendees</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Target className="h-4 w-4" />
                      <span>{activity.targetAudience}</span>
                    </div>
                  </div>

                  {activity.averageRating > 0 && (
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex items-center space-x-1">
                        {renderStars(activity.averageRating)}
                      </div>
                      <span className="text-sm text-gray-600">({activity.averageRating.toFixed(1)})</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-xs text-gray-500">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleView(activity)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(activity)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(activity.id)}
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

          <Modal
            isOpen={showModal}
            onClose={resetForm}
            title={editingActivity ? 'Edit Activity' : 'Add New Activity'}
            size="lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
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
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="workshop">Workshop</option>
                    <option value="awareness">Awareness</option>
                    <option value="training">Training</option>
                    <option value="meeting">Meeting</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School
                  </label>
                  <input
                    type="text"
                    value={formData.school}
                    onChange={(e) => setFormData({...formData, school: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Government High School, Delhi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organizer
                  </label>
                  <input
                    type="text"
                    value={formData.organizer}
                    onChange={(e) => setFormData({...formData, organizer: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Parent-Teacher Committee"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2:00 PM - 4:00 PM"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Attendees
                  </label>
                  <input
                    type="number"
                    value={formData.maxAttendees}
                    onChange={(e) => setFormData({...formData, maxAttendees: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({...formData, venue: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="School Auditorium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="students">Students</option>
                    <option value="parents">Parents</option>
                    <option value="teachers">Teachers</option>
                    <option value="both">Students & Parents</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objectives (one per line)
                </label>
                <textarea
                  value={formData.objectives}
                  onChange={(e) => setFormData({...formData, objectives: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Understand the importance of DBT for scholarships&#10;Learn how to check Aadhaar seeding status"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agenda (format: time - topic, one per line)
                </label>
                <textarea
                  value={formData.agenda}
                  onChange={(e) => setFormData({...formData, agenda: e.target.value})}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="2:00 PM - Welcome & Introduction&#10;2:15 PM - What is DBT and why it matters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="DBT, Aadhaar, Parents, Scholarships"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="flex items-center pt-6">
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
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingActivity ? 'Update Activity' : 'Create Activity'}
                </Button>
              </div>
            </form>
          </Modal>

          <Modal
            isOpen={showDetailModal}
            onClose={() => setShowDetailModal(false)}
            title="Activity Details"
            size="lg"
          >
            {selectedActivity && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedActivity.title}
                  </h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(selectedActivity.type)}`}>
                      {selectedActivity.type}
                    </span>
                    <span className="text-sm text-gray-500">
                      {selectedActivity.school}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-700">{selectedActivity.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Event Details</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Date: {new Date(selectedActivity.date).toLocaleDateString()}</p>
                      <p>Time: {selectedActivity.time}</p>
                      <p>Venue: {selectedActivity.venue}</p>
                      <p>Organizer: {selectedActivity.organizer}</p>
                      <p>Target: {selectedActivity.targetAudience}</p>
                      <p>Capacity: {selectedActivity.maxAttendees}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Statistics</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Attendees: {selectedActivity.attendees || 0}</p>
                      <p>Registered: {selectedActivity.registeredUsers?.length || 0}</p>
                      <p>Status: {selectedActivity.status}</p>
                      <p>Priority: {selectedActivity.priority}</p>
                      {selectedActivity.averageRating > 0 && (
                        <p>Rating: {selectedActivity.averageRating.toFixed(1)}/5</p>
                      )}
                    </div>
                  </div>
                </div>

                {selectedActivity.objectives && selectedActivity.objectives.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Objectives</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {selectedActivity.objectives.map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedActivity.agenda && selectedActivity.agenda.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Agenda</h4>
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

                <div className="text-sm text-gray-500 pt-4 border-t">
                  <p>Created: {new Date(selectedActivity.createdAt).toLocaleString()}</p>
                  <p>Updated: {new Date(selectedActivity.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default SchoolActivitiesManagement;