import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const eventService = {
  getAllEvents: () => axios.get(`${API_BASE_URL}/events`),
  getEventById: (id) => axios.get(`${API_BASE_URL}/events/${id}`),
  createEvent: (event) => axios.post(`${API_BASE_URL}/events`, event),
  updateEvent: (id, event) => axios.put(`${API_BASE_URL}/events/${id}`, event),
  deleteEvent: (id) => axios.delete(`${API_BASE_URL}/events/${id}`),
  getUpcomingEvents: () => axios.get(`${API_BASE_URL}/events/upcoming`),
  getEventsByStatus: (status) => axios.get(`${API_BASE_URL}/events/status/${status}`),
  getEventsByType: (type) => axios.get(`${API_BASE_URL}/events/type/${type}`),
  searchEvents: (title) => axios.get(`${API_BASE_URL}/events/search?title=${title}`)
};

export default eventService;