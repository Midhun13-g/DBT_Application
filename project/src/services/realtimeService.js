class RealtimeService {
  constructor() {
    this.listeners = new Map();
    this.setupStorageListener();
  }

  setupStorageListener() {
    window.addEventListener('storage', (e) => {
      if (e.key && this.listeners.has(e.key)) {
        const callbacks = this.listeners.get(e.key);
        callbacks.forEach(callback => {
          try {
            const newValue = e.newValue ? JSON.parse(e.newValue) : null;
            callback(newValue, e.oldValue);
          } catch (error) {
            console.error('Error parsing storage event:', error);
          }
        });
      }
    });
  }

  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(key);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }

  emit(key, data) {
    // For same-tab updates, manually trigger callbacks
    if (this.listeners.has(key)) {
      const callbacks = this.listeners.get(key);
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in realtime callback:', error);
        }
      });
    }
  }

  // Specific methods for different data types
  noticeUpdated(notices) {
    this.emit('noticeBoard', notices);
  }

  communityActionUpdated(actions) {
    this.emit('communityActions', actions);
  }
}

export default new RealtimeService();