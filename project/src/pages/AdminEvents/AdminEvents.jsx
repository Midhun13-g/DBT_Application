import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Calendar, MapPin, Users, Clock, CheckCircle } from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { DISTRICTS } from '../../utils/constants';
import realtimeManager from '../../services/realtimeManager';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    actionType: 'HEALTH_CAMP',
    district: '',
    venue: '',
    actionDate: '',
    maxParticipants: 50,
    isActive: true
  });

  useEffect(() => {
    // Initialize data and load events
    realtimeManager.initializeData();
    const initialEvents = realtimeManager.getData('EVENTS');
    setEvents(initialEvents);

    // Subscribe to real-time updates
    const unsubscribe = realtimeManager.subscribe('EVENTS', (updatedEvents) => {
      console.log('AdminEvents: Received event update');
      setEvents(updatedEvents);
    });

    return unsubscribe;
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        realtimeManager.updateEvent(editingEvent.id, formData);
      } else {
        realtimeManager.createEvent({
          ...formData,
          currentParticipants: 0
        });
      }
      resetForm();
      alert('Event saved successfully!');
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event. Please try again.');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      actionType: event.actionType,
      district: event.district,
      venue: event.venue,
      actionDate: event.actionDate ? event.actionDate.slice(0, 16) : '',
      maxParticipants: event.maxParticipants,
      isActive: event.isActive
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      realtimeManager.deleteEvent(id);
    }
  };

  const handleView = (event) => {
    setViewingEvent(event);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      actionType: 'HEALTH_CAMP',
      district: '',
      venue: '',
      actionDate: '',
      maxParticipants: 50,
      isActive: true
    });
    setEditingEvent(null);
    setShowModal(false);
  };

  const getActionTypeColor = (type) => {
    switch (type) {
      case 'HEALTH_CAMP': return 'bg-green-100 text-green-800';
      case 'EDUCATION_PROGRAM': return 'bg-blue-100 text-blue-800';
      case 'SKILL_DEVELOPMENT': return 'bg-purple-100 text-purple-800';
      case 'AWARENESS_CAMPAIGN': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date specified';
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Community Events Management
            </h1>
            <p className="text-gray-600">
              Create and manage community events and activities
            </p>
          </div>
          <Button onClick={() => setShowModal(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Event</span>
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{events.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Events</p>
                <p className="text-2xl font-bold text-green-600">
                  {events.filter(e => e.isActive).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Participants</p>
                <p className="text-2xl font-bold text-purple-600">
                  {events.reduce((sum, e) => sum + (e.currentParticipants || 0), 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p className="text-2xl font-bold text-orange-600">
                  {events.filter(e => e.actionDate && new Date(e.actionDate) > new Date()).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </Card>
        </div>

        {/* Events Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    District & Venue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {event.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {event.description.substring(0, 100)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionTypeColor(event.actionType)}`}>
                        {event.actionType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <div>{event.district || 'All Districts'}</div>
                        <div className="text-gray-500">{event.venue}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {event.actionDate ? formatDate(event.actionDate) : 'No date'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {event.currentParticipants || 0} / {event.maxParticipants}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        event.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {event.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleView(event)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(event)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(event.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={showModal}
          onClose={resetForm}
          title={editingEvent ? 'Edit Event' : 'Add New Event'}
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
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type
                </label>
                <select
                  value={formData.actionType}
                  onChange={(e) => setFormData({...formData, actionType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="HEALTH_CAMP">Health Camp</option>
                  <option value="EDUCATION_PROGRAM">Education Program</option>
                  <option value="SKILL_DEVELOPMENT">Skill Development</option>
                  <option value="AWARENESS_CAMPAIGN">Awareness Campaign</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Participants
                </label>
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({...formData, district: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Districts</option>
                  {DISTRICTS.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({...formData, venue: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Community Center"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date & Time
              </label>
              <input
                type="datetime-local"
                value={formData.actionDate}
                onChange={(e) => setFormData({...formData, actionDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

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

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editingEvent ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* View Modal */}
        <Modal
          isOpen={!!viewingEvent}
          onClose={() => setViewingEvent(null)}
          title="Event Details"
        >
          {viewingEvent && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {viewingEvent.title}
                </h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionTypeColor(viewingEvent.actionType)} mt-2`}>
                  {viewingEvent.actionType.replace('_', ' ')}
                </span>
              </div>
              
              <div>
                <p className="text-gray-700">{viewingEvent.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">District:</span> {viewingEvent.district || 'All Districts'}
                </div>
                <div>
                  <span className="font-medium">Venue:</span> {viewingEvent.venue}
                </div>
                <div>
                  <span className="font-medium">Participants:</span> {viewingEvent.currentParticipants || 0} / {viewingEvent.maxParticipants}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {viewingEvent.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>

              {viewingEvent.actionDate && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(viewingEvent.actionDate)}</span>
                </div>
              )}

              <div className="text-sm text-gray-500 pt-4 border-t">
                <p>Created: {formatDate(viewingEvent.createdAt)}</p>
                <p>Updated: {formatDate(viewingEvent.updatedAt)}</p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AdminEvents;