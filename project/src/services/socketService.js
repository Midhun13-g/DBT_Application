import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  async connect() {
    if (this.connected) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        this.socket = io('http://localhost:3001', {
          transports: ['websocket', 'polling'],
          timeout: 5000,
          forceNew: true
        });

        this.socket.on('connect', () => {
          console.log('✅ Socket.IO Connected');
          this.connected = true;
          this.reconnectAttempts = 0;
          resolve();
        });

        this.socket.on('disconnect', (reason) => {
          console.log('🔌 Socket.IO Disconnected:', reason);
          this.connected = false;
          this.handleReconnect();
        });

        this.socket.on('connect_error', (error) => {
          console.error('❌ Socket.IO Connection Error:', error);
          this.connected = false;
          reject(error);
        });

        this.socket.on('registration_confirmed', (data) => {
          console.log('✅ Registration confirmed:', data);
        });

        // Listen for content updates
        this.socket.on('content_update', (data) => {
          console.log('📚 Received content update:', data);
          this.handleContentUpdate(data);
        });

        this.socket.on('notice_update', (data) => {
          console.log('📢 Received notice update:', data);
          this.handleNoticeUpdate(data);
        });
        
        this.socket.on('event_update', (data) => {
          console.log('📅 Received event update:', data);
          this.handleEventUpdate(data);
        });
        
        this.socket.on('data_sync', (data) => {
          console.log('🔄 Received data sync:', data);
          this.handleDataSync(data);
        });

      } catch (error) {
        console.error('Socket.IO setup error:', error);
        reject(error);
      }
    });
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect().catch(console.error);
      }, 3000 * this.reconnectAttempts);
    }
  }

  handleContentUpdate(data) {
    // Trigger custom event for content updates
    window.dispatchEvent(new CustomEvent('contentUpdate', { detail: data }));
  }

  handleNoticeUpdate(data) {
    // Update localStorage with server data if available
    if (data.allNotices) {
      localStorage.setItem('notices', JSON.stringify(data.allNotices));
      console.log('💾 Updated localStorage with server data:', data.allNotices.length, 'notices');
    }
    
    // Trigger custom event for notice updates
    window.dispatchEvent(new CustomEvent('noticeUpdate', { detail: data }));
  }
  
  handleEventUpdate(data) {
    // Update localStorage with server data if available
    if (data.allEvents) {
      localStorage.setItem('events', JSON.stringify(data.allEvents));
      console.log('💾 Updated localStorage with server events:', data.allEvents.length, 'events');
    }
    
    // Trigger custom event for event updates
    window.dispatchEvent(new CustomEvent('eventUpdate', { detail: data }));
  }
  
  handleDataSync(data) {
    // Sync all data from server
    if (data.notices) {
      localStorage.setItem('notices', JSON.stringify(data.notices));
      console.log('🔄 Synced notices from server:', data.notices.length);
    }
    if (data.awareness) {
      localStorage.setItem('awarenessContent', JSON.stringify(data.awareness));
      console.log('🔄 Synced awareness from server:', data.awareness.length);
    }
    if (data.events) {
      localStorage.setItem('events', JSON.stringify(data.events));
      console.log('🔄 Synced events from server:', data.events.length);
    }
    
    // Trigger update events
    window.dispatchEvent(new CustomEvent('noticeUpdate', { detail: { type: 'DATA_SYNC' } }));
    window.dispatchEvent(new CustomEvent('contentUpdate', { detail: { type: 'DATA_SYNC' } }));
    window.dispatchEvent(new CustomEvent('eventUpdate', { detail: { type: 'DATA_SYNC' } }));
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.connected = false;
      this.listeners.clear();
    }
  }

  registerUser(userData) {
    if (this.connected && this.socket) {
      this.socket.emit('user_register', userData);
      // Request current data from server
      this.socket.emit('request_data');
    }
  }

  sendAdminContentUpdate(data) {
    if (this.connected && this.socket) {
      console.log('📚 Sending admin content update:', data);
      this.socket.emit('admin_content_update', data);
    } else {
      console.warn('Socket not connected, content update not sent');
    }
  }

  sendAdminNoticeUpdate(data) {
    if (this.connected && this.socket) {
      console.log('📢 Sending admin notice update:', data);
      this.socket.emit('admin_notice_update', data);
    } else {
      console.warn('Socket not connected, notice update not sent');
    }
  }

  isConnected() {
    return this.connected;
  }
}

const socketService = new SocketService();

// Make it globally available for debugging
if (typeof window !== 'undefined') {
  window.socketService = socketService;
}

export default socketService;