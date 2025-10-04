const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins for cross-browser access
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

app.use(cors());
app.use(express.json());

// Store connected users
let connectedUsers = new Map();
let adminUsers = new Set();
let regularUsers = new Set();
let isShuttingDown = false;

// Simple in-memory data store
let noticesData = [];
let awarenessData = [];
let eventsData = [];

// Clean up user data
const cleanupUser = (socketId) => {
  connectedUsers.delete(socketId);
  adminUsers.delete(socketId);
  regularUsers.delete(socketId);
};

io.on('connection', (socket) => {
  if (isShuttingDown) {
    socket.disconnect();
    return;
  }
  
  console.log('🔗 User connected:', socket.id);

  socket.on('user_register', (data) => {
    try {
      const { userId, role, name } = data;
      console.log(`👤 User registered: ${name} (${role})`);
      
      connectedUsers.set(socket.id, { userId, role, name });
      
      if (role === 'admin') {
        adminUsers.add(socket.id);
      } else {
        regularUsers.add(socket.id);
      }
      
      socket.emit('registration_confirmed', { success: true });
    } catch (error) {
      console.error('Error in user_register:', error);
    }
  });

  socket.on('admin_content_update', (data) => {
    try {
      console.log('📚 Admin content update:', data.type);
      
      // Handle event updates
      if (data.type === 'EVENT_CREATED') {
        eventsData.unshift(data.event);
        console.log('📅 Added event to server store. Total:', eventsData.length);
      } else if (data.type === 'EVENT_DELETED') {
        eventsData = eventsData.filter(e => e.id !== data.eventId);
        console.log('🗑️ Removed event from server store. Total:', eventsData.length);
      }
      
      // Broadcast content update
      socket.broadcast.emit('content_update', {
        type: 'CONTENT_UPDATE',
        payload: data
      });
      
      // Broadcast event-specific update
      if (data.type.includes('EVENT')) {
        socket.broadcast.emit('event_update', {
          type: 'EVENT_UPDATE',
          payload: data,
          allEvents: data.allEvents || eventsData
        });
        console.log('✅ Event update broadcasted to all users');
      }
      
      console.log('✅ Content update broadcasted to all users');
    } catch (error) {
      console.error('Error in admin_content_update:', error);
    }
  });

  socket.on('admin_notice_update', (data) => {
    try {
      console.log('📢 Admin notice update:', data.type);
      
      // Update server data store
      if (data.type === 'NOTICE_CREATED') {
        noticesData.unshift(data.notice);
        console.log('📝 Added notice to server store. Total:', noticesData.length);
      } else if (data.type === 'NOTICE_DELETED') {
        noticesData = noticesData.filter(n => n.id !== data.notice.id);
        console.log('🗑️ Removed notice from server store. Total:', noticesData.length);
      }
      
      // Broadcast to all users with updated data
      socket.broadcast.emit('notice_update', {
        type: 'NOTICE_UPDATE',
        payload: data,
        allNotices: noticesData
      });
      console.log('✅ Notice update broadcasted to all users');
    } catch (error) {
      console.error('Error in admin_notice_update:', error);
    }
  });
  
  // Send current data when user connects
  socket.on('request_data', () => {
    try {
      socket.emit('data_sync', {
        notices: noticesData,
        awareness: awarenessData,
        events: eventsData
      });
      console.log('📤 Sent current data to user:', socket.id);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 User disconnected:', socket.id, 'Reason:', reason);
    cleanupUser(socket.id);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
    cleanupUser(socket.id);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    connectedUsers: connectedUsers.size,
    admins: adminUsers.size,
    users: regularUsers.size
  });
});

const PORT = process.env.PORT || 3001;

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', error);
  }
});

// Graceful shutdown
const shutdown = (signal) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
  
  // Clear all data structures
  connectedUsers.clear();
  adminUsers.clear();
  regularUsers.clear();
  
  // Close socket.io
  io.close((err) => {
    if (err) console.error('Error closing socket.io:', err);
    else console.log('✅ Socket.IO closed');
    
    // Close HTTP server
    server.close((err) => {
      if (err) console.error('Error closing server:', err);
      else console.log('✅ HTTP server closed');
      
      console.log('✅ Shutdown complete');
      process.exit(0);
    });
  });
  
  // Force exit after 3 seconds
  setTimeout(() => {
    console.log('⚠️ Force exit');
    process.exit(1);
  }, 3000);
};

// Handle different shutdown signals
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGQUIT', () => shutdown('SIGQUIT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  shutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  shutdown('unhandledRejection');
});

server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`);
  console.log(`📡 CORS enabled for: http://localhost:5173, http://localhost:3000`);
  console.log('🛑 Press Ctrl+C to stop the server');
});

// Don't export anything to prevent module caching issues