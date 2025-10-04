import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, RefreshCw, Wifi, WifiOff, Filter, Search, Star, Eye, Phone, Mail, FileText, Tag } from 'lucide-react';
import socketService from '../../services/socketService';

const CommunityEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    loadEvents();
    
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
    
    // Listen for real-time event updates
    const handleEventUpdate = (event) => {
      console.log('📅 Community event update received:', event.detail);
      if (event.detail.allEvents) {
        localStorage.setItem('events', JSON.stringify(event.detail.allEvents));
      }
      loadEvents();
    };
    
    window.addEventListener('eventUpdate', handleEventUpdate);
    
    // Check connection status
    const statusInterval = setInterval(() => {
      setIsConnected(socketService.isConnected());
    }, 3000);
    
    // Fallback polling for offline mode
    const pollInterval = setInterval(() => {
      if (!socketService.isConnected()) {
        loadEvents();
      }
    }, 10000);
    
    return () => {
      window.removeEventListener('eventUpdate', handleEventUpdate);
      clearInterval(statusInterval);
      clearInterval(pollInterval);
    };
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, filterType, showFeaturedOnly]);

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
      
      if (data.length === 0) {
        // Initialize with comprehensive dummy data
        const dummyEvents = [
          {
            id: 1,
            title: "Digital Literacy Workshop for Senior Citizens",
            description: "Learn basic computer skills, internet usage, and digital payment methods in this comprehensive workshop.",
            detailedDescription: "This workshop is specially designed for senior citizens to help them navigate the digital world confidently. Sessions cover smartphone usage, online banking, government e-services, video calling with family, and staying safe online.",
            actionType: "DIGITAL_LITERACY",
            targetAudience: "SENIOR_CITIZENS",
            district: "Delhi",
            venue: "Community Center",
            venueAddress: "Sector 15, Dwarka, New Delhi - 110075",
            actionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            registrationDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            durationHours: 4,
            maxParticipants: 30,
            registrationFee: 0,
            contactPerson: "Mrs. Priya Sharma",
            contactPhone: "+91-9876543210",
            contactEmail: "priya.sharma@digitalindia.gov.in",
            requirements: "No prior computer knowledge required. Bring a valid ID proof for registration.",
            benefits: "Certificate of completion, free learning materials, ongoing support for 3 months.",
            agenda: "10:00 AM - Introduction to computers\n11:00 AM - Internet basics\n12:00 PM - Digital payments\n1:00 PM - Q&A and practice session",
            tags: ["digital literacy", "senior citizens", "free workshop"],
            isActive: true,
            isFeatured: true,
            requiresRegistration: true,
            createdAt: new Date().toISOString(),
            currentParticipants: 0,
            registeredParticipants: []
          },
          {
            id: 2,
            title: "Women's Health and Nutrition Camp",
            description: "Free health checkup, nutrition counseling, and awareness session for women's health and wellness.",
            detailedDescription: "Comprehensive health camp focusing on women's health issues including maternal health, nutrition during pregnancy, preventive care, and general wellness. Free consultations with qualified doctors and nutritionists.",
            actionType: "HEALTH_CHECKUP",
            targetAudience: "WOMEN",
            district: "Mumbai",
            venue: "Primary Health Center",
            venueAddress: "Andheri East, Mumbai, Maharashtra - 400069",
            actionDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            durationHours: 6,
            maxParticipants: 100,
            registrationFee: 0,
            contactPerson: "Dr. Anjali Mehta",
            contactPhone: "+91-9123456789",
            contactEmail: "anjali.mehta@health.gov.in",
            requirements: "Bring previous medical reports if any. Fasting required for blood tests (8-10 hours).",
            benefits: "Free health checkup, blood tests, nutrition chart, health awareness materials.",
            agenda: "9:00 AM - Registration\n10:00 AM - General checkup\n12:00 PM - Blood tests\n2:00 PM - Nutrition counseling\n3:00 PM - Health awareness session",
            tags: ["women health", "free checkup", "nutrition"],
            isActive: true,
            isFeatured: false,
            requiresRegistration: true,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            currentParticipants: 0,
            registeredParticipants: []
          },
          {
            id: 3,
            title: "Skill Development Program - Tailoring and Embroidery",
            description: "3-month certification course in tailoring and embroidery skills with job placement assistance.",
            detailedDescription: "Professional skill development program designed to provide employment opportunities. Course includes basic to advanced tailoring techniques, machine operation, embroidery work, and business skills for self-employment.",
            actionType: "SKILL_DEVELOPMENT",
            targetAudience: "WOMEN",
            district: "Bangalore",
            venue: "Skill Development Institute",
            venueAddress: "Jayanagar, Bangalore, Karnataka - 560011",
            actionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            registrationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            durationHours: 240,
            maxParticipants: 25,
            registrationFee: 500,
            contactPerson: "Ms. Kavitha Reddy",
            contactPhone: "+91-9876501234",
            contactEmail: "kavitha.reddy@skill.gov.in",
            requirements: "Age 18-45 years, basic education (8th standard), commitment for full course duration.",
            benefits: "Government certification, sewing machine on loan, job placement assistance, monthly stipend during training.",
            agenda: "Week 1-4: Basic tailoring\nWeek 5-8: Advanced techniques\nWeek 9-12: Embroidery and finishing\nWeek 13: Business skills and certification",
            tags: ["skill development", "tailoring", "certification", "job placement"],
            isActive: true,
            isFeatured: true,
            requiresRegistration: true,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            currentParticipants: 0,
            registeredParticipants: []
          },
          {
            id: 4,
            title: "Financial Literacy and Banking Awareness",
            description: "Learn about banking services, digital payments, investment options, and financial planning.",
            detailedDescription: "Comprehensive program to improve financial literacy among citizens. Topics include opening bank accounts, understanding different banking products, digital payment methods, investment basics, insurance, and retirement planning.",
            actionType: "FINANCIAL_LITERACY",
            targetAudience: "ALL",
            district: "Chennai",
            venue: "District Collectorate Hall",
            venueAddress: "Anna Salai, Chennai, Tamil Nadu - 600002",
            actionDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
            registrationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            durationHours: 3,
            maxParticipants: 200,
            registrationFee: 0,
            contactPerson: "Mr. Rajesh Kumar",
            contactPhone: "+91-9445566778",
            contactEmail: "rajesh.kumar@finance.gov.in",
            requirements: "Basic understanding of numbers, bring bank passbook if available.",
            benefits: "Financial literacy certificate, banking guide booklet, assistance in opening bank account.",
            agenda: "2:00 PM - Banking basics\n2:45 PM - Digital payments\n3:30 PM - Investment and insurance\n4:15 PM - Q&A session",
            tags: ["financial literacy", "banking", "digital payments", "investment"],
            isActive: true,
            isFeatured: false,
            requiresRegistration: false,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            currentParticipants: 0,
            registeredParticipants: []
          }
        ];
        
        localStorage.setItem('events', JSON.stringify(dummyEvents));
        data = dummyEvents;
      }
      
      // Ensure all events have required fields
      data = data.map(event => ({
        ...event,
        tags: event.tags || [],
        registeredParticipants: event.registeredParticipants || [],
        currentParticipants: event.currentParticipants || 0,
        isActive: event.isActive !== false
      }));
      
      const activeEvents = data.filter(event => event.isActive);
      setEvents(activeEvents);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'ALL') {
      filtered = filtered.filter(event => event.actionType === filterType);
    }

    // Filter by featured
    if (showFeaturedOnly) {
      filtered = filtered.filter(event => event.isFeatured);
    }

    setFilteredEvents(filtered);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'DIGITAL_LITERACY': return Users;
      case 'HEALTH_CHECKUP': return Clock;
      case 'SKILL_DEVELOPMENT': return Users;
      case 'FINANCIAL_LITERACY': return Users;
      default: return Calendar;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUpcoming = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) > new Date();
  };

  const viewEventDetails = (event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Events</h1>
            <p className="text-xl text-gray-600 mb-4">
              Discover and participate in community programs and events
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <span className="text-lg font-medium text-gray-700">{filteredEvents.length} Events Available</span>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                isConnected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                <span>{isConnected ? 'Live Updates' : 'Offline Mode'}</span>
              </div>
              {lastUpdate && (
                <p className="text-sm text-gray-500">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={loadEvents}
            className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors shadow-md"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search events by title, description, district, or venue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 min-w-[200px]"
              >
                <option value="ALL">All Event Types</option>
                <option value="DIGITAL_LITERACY">Digital Literacy</option>
                <option value="HEALTH_CHECKUP">Health Checkup</option>
                <option value="SKILL_DEVELOPMENT">Skill Development</option>
                <option value="FINANCIAL_LITERACY">Financial Literacy</option>
              </select>
              <button
                onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                className={`px-4 py-3 rounded-lg flex items-center space-x-2 transition-colors ${
                  showFeaturedOnly
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Star className="h-4 w-4" />
                <span>Featured Only</span>
              </button>
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
                {searchTerm || filterType !== 'ALL' || showFeaturedOnly
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Check back later for new community events.'
                }
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => {
              const TypeIcon = getTypeIcon(event.actionType);
              const upcoming = isUpcoming(event.actionDate);
              
              return (
                <div key={event.id} className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 p-6 group transform hover:-translate-y-1 ${
                  event.isFeatured ? 'border-purple-500 bg-purple-50' :
                  upcoming ? 'border-green-500 bg-green-50' :
                  'border-gray-300 bg-white'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        event.isFeatured ? 'bg-purple-100' :
                        upcoming ? 'bg-green-100' :
                        'bg-gray-100'
                      }`}>
                        <TypeIcon className={`h-5 w-5 ${
                          event.isFeatured ? 'text-purple-600' :
                          upcoming ? 'text-green-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">{event.title}</h3>
                        <p className="text-sm text-gray-500">
                          {event.district || 'All Districts'} • Community Event
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {event.isFeatured && (
                        <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full flex items-center space-x-1">
                          <Star className="h-3 w-3" />
                          <span>Featured</span>
                        </span>
                      )}
                      {upcoming && (
                        <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                          Upcoming
                        </span>
                      )}
                      {event.registrationFee === 0 && (
                        <span className="px-2 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
                          Free
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">{event.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {event.actionType.replace('_', ' ')}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {event.targetAudience.replace('_', ' ')}
                      </span>
                      {event.requiresRegistration && (
                        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                          Registration Required
                        </span>
                      )}
                    </div>
                    
                    {event.actionDate && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{formatDate(event.actionDate)}</span>
                        {formatTime(event.actionDate) && <span>• {formatTime(event.actionDate)}</span>}
                      </div>
                    )}
                    
                    {event.venue && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <span>{event.venue}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span>{event.durationHours}h duration</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <span>{event.currentParticipants || 0}/{event.maxParticipants}</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              ((event.currentParticipants || 0) / event.maxParticipants) > 0.8 ? 'bg-red-500' :
                              ((event.currentParticipants || 0) / event.maxParticipants) > 0.6 ? 'bg-yellow-500' :
                              'bg-green-600'
                            }`}
                            style={{ width: `${Math.min(((event.currentParticipants || 0) / event.maxParticipants) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {event.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                      {event.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{event.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Created: {new Date(event.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-2">
                        {event.requiresRegistration && upcoming && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              alert('Registration functionality would be implemented here.');
                            }}
                            className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                            disabled={(event.currentParticipants || 0) >= event.maxParticipants}
                          >
                            {(event.currentParticipants || 0) >= event.maxParticipants ? 'Full' : 'Register'}
                          </button>
                        )}
                        <button 
                          onClick={() => viewEventDetails(event)}
                          className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors flex items-center space-x-1"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Learn More</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{selectedEvent.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full font-medium">
                      {selectedEvent.actionType.replace('_', ' ')}
                    </span>
                    <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-medium">
                      {selectedEvent.targetAudience.replace('_', ' ')}
                    </span>
                    {selectedEvent.isFeatured && (
                      <span className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full font-medium flex items-center space-x-1">
                        <Star className="h-3 w-3" />
                        <span>Featured</span>
                      </span>
                    )}
                    {isUpcoming(selectedEvent.actionDate) && (
                      <span className="px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full font-medium">
                        Upcoming
                      </span>
                    )}
                    {selectedEvent.registrationFee === 0 && (
                      <span className="px-3 py-1 text-sm bg-emerald-100 text-emerald-800 rounded-full font-medium">
                        Free Event
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">About This Event</h4>
                  <p className="text-green-800 leading-relaxed">{selectedEvent.description}</p>
                  {selectedEvent.detailedDescription && (
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <p className="text-green-700 leading-relaxed">{selectedEvent.detailedDescription}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span>Event Schedule</span>
                    </h4>
                    <div className="space-y-2 text-sm">
                      {selectedEvent.actionDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date & Time:</span>
                          <span className="font-medium">{new Date(selectedEvent.actionDate).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{selectedEvent.durationHours} hours</span>
                      </div>
                      {selectedEvent.registrationDeadline && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Registration Deadline:</span>
                          <span className="font-medium text-red-600">{new Date(selectedEvent.registrationDeadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <span>Location Details</span>
                    </h4>
                    <div className="space-y-2 text-sm">
                      {selectedEvent.venue && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Venue:</span>
                          <span className="font-medium">{selectedEvent.venue}</span>
                        </div>
                      )}
                      {selectedEvent.venueAddress && (
                        <div>
                          <span className="text-gray-600">Address:</span>
                          <p className="font-medium mt-1">{selectedEvent.venueAddress}</p>
                        </div>
                      )}
                      {selectedEvent.district && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">District:</span>
                          <span className="font-medium">{selectedEvent.district}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span>Participation Details</span>
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Max Participants:</span>
                        <span className="font-medium">{selectedEvent.maxParticipants}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Registration Fee:</span>
                        <span className="font-medium">
                          {selectedEvent.registrationFee > 0 ? `₹${selectedEvent.registrationFee}` : 'Free'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Registration Required:</span>
                        <span className="font-medium">
                          {selectedEvent.requiresRegistration ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-900 mb-3 flex items-center space-x-2">
                      <Phone className="h-5 w-5 text-purple-600" />
                      <span>Contact Information</span>
                    </h4>
                    <div className="space-y-2 text-sm">
                      {selectedEvent.contactPerson && (
                        <div className="flex justify-between">
                          <span className="text-purple-700">Contact Person:</span>
                          <span className="font-medium">{selectedEvent.contactPerson}</span>
                        </div>
                      )}
                      {selectedEvent.contactPhone && (
                        <div className="flex justify-between">
                          <span className="text-purple-700">Phone:</span>
                          <a href={`tel:${selectedEvent.contactPhone}`} className="font-medium text-purple-600 hover:underline">
                            {selectedEvent.contactPhone}
                          </a>
                        </div>
                      )}
                      {selectedEvent.contactEmail && (
                        <div className="flex justify-between">
                          <span className="text-purple-700">Email:</span>
                          <a href={`mailto:${selectedEvent.contactEmail}`} className="font-medium text-purple-600 hover:underline">
                            {selectedEvent.contactEmail}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {(selectedEvent.requirements || selectedEvent.benefits) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedEvent.requirements && (
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-900 mb-2 flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-yellow-600" />
                          <span>Requirements</span>
                        </h4>
                        <p className="text-yellow-800 text-sm leading-relaxed">{selectedEvent.requirements}</p>
                      </div>
                    )}
                    {selectedEvent.benefits && (
                      <div className="bg-emerald-50 rounded-lg p-4">
                        <h4 className="font-semibold text-emerald-900 mb-2 flex items-center space-x-2">
                          <Star className="h-5 w-5 text-emerald-600" />
                          <span>Benefits</span>
                        </h4>
                        <p className="text-emerald-800 text-sm leading-relaxed">{selectedEvent.benefits}</p>
                      </div>
                    )}
                  </div>
                )}

                {selectedEvent.agenda && (
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <h4 className="font-semibold text-indigo-900 mb-2 flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-indigo-600" />
                      <span>Event Agenda</span>
                    </h4>
                    <p className="text-indigo-800 text-sm leading-relaxed whitespace-pre-line">{selectedEvent.agenda}</p>
                  </div>
                )}

                {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <Tag className="h-5 w-5 text-gray-600" />
                      <span>Tags</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-6 border-t mt-6">
                <div className="text-sm text-gray-500">
                  <span>Event created: {new Date(selectedEvent.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                  {selectedEvent.requiresRegistration && (
                    <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                      Register Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityEvents;