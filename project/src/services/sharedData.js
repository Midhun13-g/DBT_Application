// Simple shared data store
class SharedDataStore {
  constructor() {
    this.notices = [
      {
        id: 1,
        title: 'Welcome Notice',
        content: 'Welcome to the DBT Notice Board system',
        type: 'GENERAL',
        priority: 'MEDIUM',
        district: 'Delhi',
        isActive: true,
        createdAt: new Date().toISOString(),
        author: 'System Admin'
      }
    ];
    this.events = [
      {
        id: 1,
        title: 'Digital Literacy Workshop',
        description: 'Learn basic computer skills',
        actionType: 'DIGITAL_LITERACY',
        targetAudience: 'ALL',
        district: 'Delhi',
        venue: 'Community Center',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];
    this.listeners = [];
  }

  // Notices
  getNotices() {
    return [...this.notices];
  }

  addNotice(notice) {
    const newNotice = {
      ...notice,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      author: 'Admin'
    };
    this.notices.unshift(newNotice);
    this.notifyListeners();
    return newNotice;
  }

  deleteNotice(id) {
    this.notices = this.notices.filter(n => n.id !== id);
    this.notifyListeners();
  }

  // Events
  getEvents() {
    return [...this.events];
  }

  addEvent(event) {
    const newEvent = {
      ...event,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      currentParticipants: 0
    };
    this.events.unshift(newEvent);
    this.notifyListeners();
    return newEvent;
  }

  deleteEvent(id) {
    this.events = this.events.filter(e => e.id !== id);
    this.notifyListeners();
  }

  // Listeners
  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback());
  }
}

export default new SharedDataStore();