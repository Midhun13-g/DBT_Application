import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, Wifi, WifiOff, Users, MapPin, Clock, Search, Eye, FileText, Tag, Phone } from 'lucide-react';
import socketService from '../../services/socketService';

const AdminCommunityEvents = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailedDescription: '',
    actionType: 'DIGITAL_LITERACY',
    targetAudience: 'ALL',
    district: '',
    venue: '',
    venueAddress: '',
    actionDate: '',
    registrationDeadline: '',
    durationHours: 2,
    maxParticipants: 50,
    registrationFee: 0,
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    requirements: '',
    benefits: '',
    agenda: '',
    tags: '',
    isActive: true,
    isFeatured: false,
    requiresRegistration: true
  });

  useEffect(() => {
    loadEvents();
    
    // Listen for event updates
    const handleEventUpdate = (event) => {
      loadEvents();
    };
    
    window.addEventListener('eventUpdate', handleEventUpdate);
    return () => {
      window.removeEventListener('eventUpdate', handleEventUpdate);
    };
  }, []);

  const loadEvents = () => {
    try {
      const stored = localStorage.getItem('events');
      let data = [];
      
      if (!stored) {
        data = [];
      } else {
        try {
          data = JSON.parse(stored);
        } catch (error) {
          console.error('Error parsing stored events:', error);
          data = [];
        }
      }
      
      // Dummy data is now handled by DummyDataInitializer component
      // No need to reinitialize here
      
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!formData.description.trim()) {
      alert('Please enter a description');
      return;
    }
    try {
      let data = JSON.parse(localStorage.getItem('events') || '[]');
      
      // Don't reinitialize dummy data if events already exist
      // The DummyDataInitializer component handles initial data setup
      
      const newEvent = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currentParticipants: 0,
        registeredParticipants: [],
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      data.unshift(newEvent);
      localStorage.setItem('events', JSON.stringify(data));
      setEvents(data);
      
      // Broadcast event update via socket
      if (socketService.isConnected()) {
        socketService.sendAdminContentUpdate({
          type: 'EVENT_CREATED',
          event: newEvent,
          allEvents: data,
          timestamp: new Date().toISOString(),
          adminUser: 'Admin'
        });
      }
      
      // Trigger local event for immediate update
      window.dispatchEvent(new CustomEvent('eventUpdate', {
        detail: {
          type: 'EVENT_CREATED',
          event: newEvent,
          allEvents: data,
          timestamp: new Date().toISOString()
        }
      }));
      
      setFormData({
        title: '', description: '', detailedDescription: '', actionType: 'DIGITAL_LITERACY', targetAudience: 'ALL',
        district: '', venue: '', venueAddress: '', actionDate: '', registrationDeadline: '', durationHours: 2, 
        maxParticipants: 50, registrationFee: 0, contactPerson: '', contactPhone: '', contactEmail: '',
        requirements: '', benefits: '', agenda: '', tags: '', isActive: true, isFeatured: false, requiresRegistration: true
      });
      setShowModal(false);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this event?')) {
      try {
        const stored = localStorage.getItem('events') || '[]';
        const data = JSON.parse(stored);
        const filtered = data.filter(e => e.id !== id);
        localStorage.setItem('events', JSON.stringify(filtered));
        setEvents(filtered);
        
        // Broadcast event deletion via socket
        if (socketService.isConnected()) {
          socketService.sendAdminContentUpdate({
            type: 'EVENT_DELETED',
            eventId: id,
            allEvents: filtered,
            timestamp: new Date().toISOString(),
            adminUser: 'Admin'
          });
        }
        
        // Trigger local event for immediate update
        window.dispatchEvent(new CustomEvent('eventUpdate', {
          detail: {
            type: 'EVENT_DELETED',
            eventId: id,
            allEvents: filtered,
            timestamp: new Date().toISOString()
          }
        }));
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const toggleEventStatus = (id) => {
    try {
      const stored = localStorage.getItem('events') || '[]';
      const data = JSON.parse(stored);
      const updatedData = data.map(event => 
        event.id === id ? { ...event, isActive: !event.isActive } : event
      );
      localStorage.setItem('events', JSON.stringify(updatedData));
      setEvents(updatedData);
      
      if (socketService.isConnected()) {
        socketService.sendAdminContentUpdate({
          type: 'EVENT_UPDATED',
          allEvents: updatedData,
          timestamp: new Date().toISOString(),
          adminUser: 'Admin'
        });
      }
      
      // Trigger local event for immediate update
      window.dispatchEvent(new CustomEvent('eventUpdate', {
        detail: {
          type: 'EVENT_UPDATED',
          allEvents: updatedData,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error) {
      console.error('Error updating event status:', error);
    }
  };

  const viewEventDetails = (event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.district && event.district.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (event.venue && event.venue.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'ALL' || event.actionType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Community Events Management</h1>
            <p className="text-xl text-gray-600">Create and manage community events and programs</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus className="h-5 w-5" />
            <span>Add Event</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search events by title, description, or district..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-64">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Event Types</option>
                <option value="DIGITAL_LITERACY">Digital Literacy</option>
                <option value="HEALTH_CHECKUP">Health Checkup</option>
                <option value="SKILL_DEVELOPMENT">Skill Development</option>
                <option value="FINANCIAL_LITERACY">Financial Literacy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm || filterType !== 'ALL' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Create your first community event to get started.'
                }
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{event.title}</h3>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {event.actionType.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {event.isFeatured && (
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full font-medium">
                        Featured
                      </span>
                    )}
                    <button
                      onClick={() => toggleEventStatus(event.id)}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        event.isActive 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {event.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">{event.description}</p>

                <div className="space-y-2 mb-4">
                  {event.venue && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{event.venue}</span>
                    </div>
                  )}
                  
                  {event.district && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {event.district}
                      </span>
                    </div>
                  )}

                  {event.actionDate && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(event.actionDate).toLocaleDateString()} at {new Date(event.actionDate).toLocaleTimeString()}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{event.durationHours}h</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Max {event.maxParticipants}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Created: {new Date(event.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => viewEventDetails(event)}
                      className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Event Details Modal */}
        {showDetailModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Event Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedEvent.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                      {selectedEvent.actionType.replace('_', ' ')}
                    </span>
                    <span className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full">
                      {selectedEvent.targetAudience.replace('_', ' ')}
                    </span>
                    {selectedEvent.isFeatured && (
                      <span className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full">
                        Featured
                      </span>
                    )}
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      selectedEvent.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedEvent.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Brief Description</h4>
                    <p className="text-gray-700 leading-relaxed">{selectedEvent.description}</p>
                  </div>
                  {selectedEvent.detailedDescription && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Detailed Description</h4>
                      <p className="text-gray-700 leading-relaxed">{selectedEvent.detailedDescription}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Event Information</h4>
                    <div className="space-y-2 text-sm">
                      {selectedEvent.actionDate && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>Date: {new Date(selectedEvent.actionDate).toLocaleString()}</span>
                        </div>
                      )}
                      {selectedEvent.registrationDeadline && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>Registration Deadline: {new Date(selectedEvent.registrationDeadline).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>Duration: {selectedEvent.durationHours} hours</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>Max Participants: {selectedEvent.maxParticipants}</span>
                      </div>
                      {selectedEvent.registrationFee > 0 && (
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span>Registration Fee: ₹{selectedEvent.registrationFee}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Location & Contact</h4>
                    <div className="space-y-2 text-sm">
                      {selectedEvent.venue && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>Venue: {selectedEvent.venue}</span>
                        </div>
                      )}
                      {selectedEvent.venueAddress && (
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                          <span>Address: {selectedEvent.venueAddress}</span>
                        </div>
                      )}
                      {selectedEvent.district && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>District: {selectedEvent.district}</span>
                        </div>
                      )}
                      {selectedEvent.contactPerson && (
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>Contact: {selectedEvent.contactPerson}</span>
                        </div>
                      )}
                      {selectedEvent.contactPhone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>Phone: {selectedEvent.contactPhone}</span>
                        </div>
                      )}
                      {selectedEvent.contactEmail && (
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span>Email: {selectedEvent.contactEmail}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {(selectedEvent.requirements || selectedEvent.benefits) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedEvent.requirements && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                        <p className="text-gray-700 leading-relaxed text-sm">{selectedEvent.requirements}</p>
                      </div>
                    )}
                    {selectedEvent.benefits && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Benefits</h4>
                        <p className="text-gray-700 leading-relaxed text-sm">{selectedEvent.benefits}</p>
                      </div>
                    )}
                  </div>
                )}

                {selectedEvent.agenda && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Event Agenda</h4>
                    <p className="text-gray-700 leading-relaxed text-sm">{selectedEvent.agenda}</p>
                  </div>
                )}

                {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    <span>Created: {new Date(selectedEvent.createdAt).toLocaleString()}</span>
                    {selectedEvent.updatedAt && selectedEvent.updatedAt !== selectedEvent.createdAt && (
                      <span className="ml-4">Updated: {new Date(selectedEvent.updatedAt).toLocaleString()}</span>
                    )}
                  </div>
                </div>
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

        {/* Create Event Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">Add New Community Event</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter event title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brief Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief overview of the event (displayed in cards)"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
                  <textarea
                    value={formData.detailedDescription}
                    onChange={(e) => setFormData({...formData, detailedDescription: e.target.value})}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Comprehensive event details, objectives, and background information"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                    <select
                      value={formData.actionType}
                      onChange={(e) => setFormData({...formData, actionType: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="DIGITAL_LITERACY">Digital Literacy</option>
                      <option value="HEALTH_CHECKUP">Health Checkup</option>
                      <option value="SKILL_DEVELOPMENT">Skill Development</option>
                      <option value="FINANCIAL_LITERACY">Financial Literacy</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                    <select
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ALL">All Citizens</option>
                      <option value="WOMEN">Women</option>
                      <option value="YOUTH">Youth</option>
                      <option value="FARMERS">Farmers</option>
                      <option value="SENIOR_CITIZENS">Senior Citizens</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => setFormData({...formData, district: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Delhi"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Venue Name</label>
                    <input
                      type="text"
                      value={formData.venue}
                      onChange={(e) => setFormData({...formData, venue: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Community Center"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Venue Address</label>
                  <input
                    type="text"
                    value={formData.venueAddress}
                    onChange={(e) => setFormData({...formData, venueAddress: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Complete address with landmarks"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Date & Time</label>
                    <input
                      type="datetime-local"
                      value={formData.actionDate}
                      onChange={(e) => setFormData({...formData, actionDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Registration Deadline</label>
                    <input
                      type="datetime-local"
                      value={formData.registrationDeadline}
                      onChange={(e) => setFormData({...formData, registrationDeadline: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Hours)</label>
                    <input
                      type="number"
                      value={formData.durationHours}
                      onChange={(e) => setFormData({...formData, durationHours: parseInt(e.target.value)})}
                      min="1"
                      max="24"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Participants</label>
                    <input
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Registration Fee (₹)</label>
                    <input
                      type="number"
                      value={formData.registrationFee}
                      onChange={(e) => setFormData({...formData, registrationFee: parseInt(e.target.value)})}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Event coordinator name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Phone number for inquiries"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Email for inquiries"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                    <textarea
                      value={formData.requirements}
                      onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Prerequisites, documents needed, eligibility criteria"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
                    <textarea
                      value={formData.benefits}
                      onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="What participants will gain from this event"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Agenda</label>
                  <textarea
                    value={formData.agenda}
                    onChange={(e) => setFormData({...formData, agenda: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Schedule, topics to be covered, timeline"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Comma-separated tags (e.g., training, workshop, certification)"
                  />
                </div>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Active Event</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">Featured Event</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requiresRegistration"
                      checked={formData.requiresRegistration}
                      onChange={(e) => setFormData({...formData, requiresRegistration: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="requiresRegistration" className="ml-2 block text-sm text-gray-900">Requires Registration</label>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
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
                    Save Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCommunityEvents;