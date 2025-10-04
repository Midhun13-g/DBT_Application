import eventBus from './eventBus';

class SimpleRealtimeService {
  constructor() {
    this.connected = false;
    this.subscribers = new Map();
    this.pollInterval = null;
    this.lastUpdate = null;
  }

  async initialize() {
    try {
      // Try WebSocket connection first
      await this.connectWebSocket();
    } catch (error) {
      console.warn('WebSocket not available, using polling fallback');
      this.startPolling();
    }
  }

  async connectWebSocket() {
    return new Promise((resolve, reject) => {
      try {
        const ws = new WebSocket('ws://localhost:8080/ws-simple');
        
        ws.onopen = () => {
          console.log('Simple WebSocket connected');
          this.connected = true;
          this.ws = ws;
          resolve();
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.connected = false;
          reject(error);
        };

        ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.connected = false;
          this.startPolling();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  handleMessage(data) {
    const { type, payload } = data;
    console.log('Received WebSocket message:', type, payload);
    
    switch (type) {
      case 'NOTICE_UPDATE':
        eventBus.emit('notices-updated');
        break;
      case 'COMMUNITY_ACTION_UPDATE':
        eventBus.emit('community-actions-updated');
        break;
      case 'NOTICE_REFRESH':
        eventBus.emit('notices-updated');
        break;
      case 'COMMUNITY_ACTION_REFRESH':
        eventBus.emit('community-actions-updated');
        break;
    }
    
    this.lastUpdate = new Date();
  }

  startPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
    
    // Poll every 5 seconds as fallback
    this.pollInterval = setInterval(() => {
      eventBus.emit('notices-updated');
      eventBus.emit('community-actions-updated');
      this.lastUpdate = new Date();
    }, 5000);
  }

  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  subscribe(type, callback) {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, new Set());
    }
    
    this.subscribers.get(type).add(callback);
    
    return () => {
      if (this.subscribers.has(type)) {
        this.subscribers.get(type).delete(callback);
      }
    };
  }

  isConnected() {
    return this.connected;
  }

  getLastUpdate() {
    return this.lastUpdate;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
    this.stopPolling();
    this.connected = false;
  }
}

export default new SimpleRealtimeService();