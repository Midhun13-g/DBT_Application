import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Search } from 'lucide-react';
import eventService from '../../services/eventService';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, filterType, filterStatus]);

  const fetchEvents = async () => {
    try {
      const response = await eventService.getAllEvents();
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'ALL') {
      filtered = filtered.filter(event => event.type === filterType);
    }

    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(event => event.status === filterStatus);
    }

    setFilteredEvents(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'UPCOMING': return '#3b82f6';
      case 'ONGOING': return '#10b981';
      case 'COMPLETED': return '#6b7280';
      case 'CANCELLED': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'WORKSHOP': return '🔧';
      case 'SEMINAR': return '🎓';
      case 'TRAINING': return '📚';
      case 'AWARENESS_CAMP': return '📢';
      case 'COMMUNITY_MEETING': return '🤝';
      case 'CULTURAL': return '🎭';
      case 'SPORTS': return '⚽';
      default: return '📅';
    }
  };

  if (loading) {
    return <div className="events-loading">Loading events...</div>;
  }

  return (
    <div className="events-container">
      <div className="events-header">
        <h1>Community Events</h1>
        <p>Stay updated with upcoming events and activities in your community</p>
      </div>

      <div className="events-controls">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="ALL">All Types</option>
            <option value="WORKSHOP">Workshop</option>
            <option value="SEMINAR">Seminar</option>
            <option value="TRAINING">Training</option>
            <option value="AWARENESS_CAMP">Awareness Camp</option>
            <option value="COMMUNITY_MEETING">Community Meeting</option>
            <option value="CULTURAL">Cultural</option>
            <option value="SPORTS">Sports</option>
          </select>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="ALL">All Status</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      <div className="events-grid">
        {filteredEvents.map(event => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <div className="event-type">
                <span className="type-icon">{getTypeIcon(event.type)}</span>
                <span className="type-text">{event.type.replace('_', ' ')}</span>
              </div>
              <div 
                className="event-status"
                style={{ backgroundColor: getStatusColor(event.status) }}
              >
                {event.status}
              </div>
            </div>

            <h3 className="event-title">{event.title}</h3>
            <p className="event-description">{event.description}</p>

            <div className="event-details">
              <div className="detail-item">
                <Calendar size={16} />
                <span>{formatDate(event.eventDate)}</span>
              </div>
              <div className="detail-item">
                <MapPin size={16} />
                <span>{event.location}</span>
              </div>
              {event.organizer && (
                <div className="detail-item">
                  <Users size={16} />
                  <span>{event.organizer}</span>
                </div>
              )}
              {event.maxParticipants && (
                <div className="detail-item">
                  <Users size={16} />
                  <span>{event.currentParticipants || 0}/{event.maxParticipants} participants</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="no-events">
          <Calendar size={48} />
          <h3>No events found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default Events;