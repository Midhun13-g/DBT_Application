import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, Clock, FileText, Plus, UserCheck, Upload, Download } from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { useAuth } from '../../hooks/useAuth';

const SchoolActivities = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    type: '',
    activityDate: '',
    registrationRequired: false,
    maxParticipants: '',
    attachments: []
  });

  const activityTypes = ['WORKSHOP', 'PTA_MEETING', 'EVENT', 'AWARENESS_PROGRAM', 'TRAINING'];

  const typeColors = {
    WORKSHOP: 'bg-blue-100 text-blue-800',
    PTA_MEETING: 'bg-green-100 text-green-800',
    EVENT: 'bg-purple-100 text-purple-800',
    AWARENESS_PROGRAM: 'bg-orange-100 text-orange-800',
    TRAINING: 'bg-indigo-100 text-indigo-800'
  };

  useEffect(() => {
    // Mock data
    setActivities([
      {
        id: 1,
        title: 'DBT Awareness Workshop for Parents',
        description: 'Learn about Direct Benefit Transfer and how to link your accounts for seamless benefit delivery. This comprehensive workshop will cover account linking procedures, status checking methods, and troubleshooting common issues. Expert facilitators will provide hands-on assistance.',
        type: 'WORKSHOP',
        schoolName: 'Government Senior Secondary School',
        activityDate: '2024-03-20T14:00:00',
        registrationRequired: true,
        maxParticipants: 50,
        registeredCount: 23,
        resourceUrl: '/resources/dbt-guide.pdf'
      },
      {
        id: 2,
        title: 'Monthly PTA Meeting',
        description: 'Discuss school activities, student progress, and upcoming events with teachers and parents. Agenda includes academic performance review, infrastructure updates, upcoming cultural events, and parent feedback session. All parents are encouraged to attend.',
        type: 'PTA_MEETING',
        schoolName: 'Government Senior Secondary School',
        activityDate: '2024-03-25T16:00:00',
        registrationRequired: false,
        maxParticipants: null,
        registeredCount: 0
      }
    ]);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRegister = (activity) => {
    setSelectedActivity(activity);
    setShowRegistrationModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">School Activities Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage and participate in school events and workshops</p>
            </div>
            {(user?.role === 'SCHOOL_COMMITTEE' || user?.role === 'ADMIN') && (
              <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
                Add Activity
              </Button>
            )}
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <Card key={activity.id} className="h-full hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeColors[activity.type]}`}>
                    {activity.type.replace('_', ' ')}
                  </span>
                  {activity.resourceUrl && (
                    <FileText className="h-4 w-4 text-gray-400" />
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{activity.title}</h3>
                <p className="text-gray-600 mb-4 flex-1">{activity.description}</p>

                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{activity.schoolName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(activity.activityDate)}</span>
                  </div>
                  {activity.registrationRequired && (
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>
                        {activity.registeredCount}/{activity.maxParticipants || '∞'} registered
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {activity.registrationRequired ? (
                    <Button 
                      size="sm" 
                      className="w-full"
                      icon={UserCheck}
                      onClick={() => handleRegister(activity)}
                    >
                      Register
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        setSelectedActivity(activity);
                        setShowDetailsModal(true);
                      }}
                    >
                      View Details
                    </Button>
                  )}
                  
                  {activity.resourceUrl && (
                    <Button variant="outline" size="sm" className="w-full" icon={Download}>
                      Download Resources
                    </Button>
                  )}
                  
                  {(user?.role === 'SCHOOL_COMMITTEE' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                    <Button variant="outline" size="sm" className="w-full" icon={Users}>
                      Mark Attendance
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Create Activity Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Add New Activity"
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newActivity.title}
                onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newActivity.description}
                onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newActivity.type}
                  onChange={(e) => setNewActivity({...newActivity, type: e.target.value})}
                >
                  <option value="">Select type</option>
                  {activityTypes.map(type => (
                    <option key={type} value={type}>{type.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time *</label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newActivity.activityDate}
                  onChange={(e) => setNewActivity({...newActivity, activityDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={newActivity.registrationRequired}
                  onChange={(e) => setNewActivity({...newActivity, registrationRequired: e.target.checked})}
                />
                Registration Required
              </label>
              
              {newActivity.registrationRequired && (
                <input
                  type="number"
                  placeholder="Max participants"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newActivity.maxParticipants}
                  onChange={(e) => setNewActivity({...newActivity, maxParticipants: e.target.value})}
                />
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Upload PDF, images, or videos</p>
                <input type="file" multiple className="hidden" />
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button onClick={() => setShowCreateModal(false)}>Create Activity</Button>
          </div>
        </Modal>

        {/* Registration Modal */}
        <Modal
          isOpen={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
          title="Register for Activity"
          size="md"
        >
          {selectedActivity && (
            <div>
              <h3 className="text-lg font-semibold mb-4">{selectedActivity.title}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Participant Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter participant name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter contact number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relationship to Student
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select relationship</option>
                    <option value="parent">Parent</option>
                    <option value="guardian">Guardian</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <Button variant="outline" onClick={() => setShowRegistrationModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowRegistrationModal(false)}>
                  Register
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Activity Details Modal */}
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Activity Details"
          size="lg"
        >
          {selectedActivity && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedActivity.title}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeColors[selectedActivity.type]}`}>
                    {selectedActivity.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700 leading-relaxed">{selectedActivity.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Event Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{selectedActivity.schoolName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{formatDate(selectedActivity.activityDate)}</span>
                    </div>
                    {selectedActivity.registrationRequired && (
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{selectedActivity.registeredCount}/{selectedActivity.maxParticipants || '∞'} registered</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>📞 School Office: +91-11-2345-6789</p>
                    <p>📧 Email: principal@school.edu.in</p>
                    <p>🏫 Address: School Main Building</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">What to Bring</h4>
                <div className="bg-green-50 p-4 rounded-lg">
                  <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                    <li>Student ID card or Aadhaar card</li>
                    <li>Notebook and pen for taking notes</li>
                    <li>Any relevant documents mentioned in the notice</li>
                    <li>Water bottle and light snacks</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Resources & Materials</h4>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" icon={FileText}>
                    Download Agenda
                  </Button>
                  <Button variant="outline" size="sm" icon={FileText}>
                    Study Materials
                  </Button>
                  <Button variant="outline" size="sm" icon={FileText}>
                    Presentation Slides
                  </Button>
                </div>
              </div>
              
              {selectedActivity.registrationRequired && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Registration Required</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    This activity requires prior registration. Please register to confirm your attendance.
                  </p>
                  <Button size="sm" icon={UserCheck}>
                    Register Now
                  </Button>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default SchoolActivities;