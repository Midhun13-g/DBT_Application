// Simple data store for real-time sync
class DataStore {
  constructor() {
    this.notices = [];
    this.communityEvents = [];
    this.listeners = [];
  }

  // Add listener for changes
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Remove listener
  removeListener(callback) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  // Notify all listeners
  notify() {
    this.listeners.forEach(callback => callback());
  }

  // Notice methods
  getNotices() {
    return [...this.notices];
  }

  addNotice(notice) {
    const newNotice = {
      ...notice,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      author: 'Admin User'
    };
    this.notices.unshift(newNotice);
    this.notify();
    return newNotice;
  }

  updateNotice(id, data) {
    const index = this.notices.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notices[index] = { ...this.notices[index], ...data, updatedAt: new Date().toISOString() };
      this.notify();
      return this.notices[index];
    }
    return null;
  }

  deleteNotice(id) {
    this.notices = this.notices.filter(n => n.id !== id);
    this.notify();
  }

  // Community Events methods
  getCommunityEvents() {
    return [...this.communityEvents];
  }

  addCommunityEvent(event) {
    const newEvent = {
      ...event,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentParticipants: 0
    };
    this.communityEvents.unshift(newEvent);
    this.notify();
    return newEvent;
  }

  updateCommunityEvent(id, data) {
    const index = this.communityEvents.findIndex(e => e.id === id);
    if (index !== -1) {
      this.communityEvents[index] = { ...this.communityEvents[index], ...data, updatedAt: new Date().toISOString() };
      this.notify();
      return this.communityEvents[index];
    }
    return null;
  }

  deleteCommunityEvent(id) {
    this.communityEvents = this.communityEvents.filter(e => e.id !== id);
    this.notify();
  }

  // Initialize with dummy data
  initializeData() {
    if (this.notices.length === 0) {
      this.notices = [
        {
          id: 1,
          title: 'Aadhaar Seeding Camp - Delhi Central',
          content: 'Free Aadhaar seeding camp for all bank account holders.',
          type: 'CAMP',
          priority: 'HIGH',
          district: 'Delhi',
          eventDate: '2024-02-15T10:00:00',
          isActive: true,
          createdAt: '2024-01-20T09:00:00',
          updatedAt: '2024-01-22T14:30:00',
          views: 125,
          author: 'Delhi Panchayat Office'
        }
      ];
    }

    if (this.communityEvents.length === 0) {
      this.communityEvents = [
        {
          id: 1,
          title: 'Digital Literacy Workshop',
          description: 'Learn smartphone usage and online banking',
          actionType: 'DIGITAL_LITERACY',
          targetAudience: 'ALL',
          district: 'Delhi',
          venue: 'Community Center',
          actionDate: '2024-02-15T10:00',
          durationHours: 4,
          maxParticipants: 50,
          currentParticipants: 23,
          contactPerson: 'John Doe',
          contactPhone: '+91-9876543210',
          contactEmail: 'john@example.com',
          registrationRequired: true,
          isActive: true,
          isFeatured: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }
  }
}

export default new DataStore();