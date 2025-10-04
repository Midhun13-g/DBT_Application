// Real-time event service for cross-component communication (similar to TeleMedicine)
class RealtimeEventService {
  constructor() {
    this.listeners = new Map();
  }

  // Emit events
  emit(eventType, data) {
    const event = new CustomEvent(eventType, { detail: data });
    window.dispatchEvent(event);
    console.log('🔄 Event emitted:', eventType, data);
  }

  // Listen to events
  on(eventType, callback) {
    const handler = (event) => callback(event.detail);
    window.addEventListener(eventType, handler);
    
    // Store for cleanup
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType).add({ callback, handler });

    return () => {
      window.removeEventListener(eventType, handler);
      if (this.listeners.has(eventType)) {
        this.listeners.get(eventType).delete({ callback, handler });
      }
    };
  }

  // Admin events
  notifyNoticeAdded(notice) {
    this.emit('notice_added', {
      notice,
      timestamp: Date.now()
    });
  }

  notifyNoticeUpdated(notice) {
    this.emit('notice_updated', {
      notice,
      timestamp: Date.now()
    });
  }

  notifyNoticeDeleted(notice) {
    this.emit('notice_deleted', {
      notice,
      timestamp: Date.now()
    });
  }

  notifyContentAdded(content) {
    this.emit('content_added', {
      content,
      timestamp: Date.now()
    });
  }

  notifyEventAdded(event) {
    this.emit('event_added', {
      event,
      timestamp: Date.now()
    });
  }

  // User events
  notifyUserActivity(activity) {
    this.emit('user_activity', {
      activity,
      timestamp: Date.now()
    });
  }

  // Generic notification
  showNotification(title, message, type = 'info') {
    this.emit('show_notification', {
      title,
      message,
      type,
      timestamp: Date.now()
    });
  }

  cleanup() {
    this.listeners.clear();
  }
}

export default new RealtimeEventService();