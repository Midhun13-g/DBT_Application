# Socket System Documentation

## Overview
The DBT Application uses a unified Socket.IO system for real-time communication between admin and user interfaces.

## Architecture

### Socket Server (`socket-server.js`)
- **Port**: 3001
- **Technology**: Socket.IO with Express
- **Features**: Real-time broadcasting, user registration, graceful shutdown

### Frontend Service (`socketService.js`)
- **Purpose**: Unified client-side socket management
- **Features**: Auto-reconnection, event handling, message broadcasting

## Components Integration

### Admin Components
- **AdminNoticeBoard**: Broadcasts notice updates to all users
- **AwarenessManagement**: Broadcasts content updates to all users

### User Components  
- **NoticeBoard**: Receives real-time notice updates
- **UserAwareness**: Receives real-time content updates

## Data Flow

1. **Admin Action**: Admin creates/updates/deletes content
2. **Local Storage**: Data saved to localStorage
3. **Socket Broadcast**: Update sent via Socket.IO to all connected users
4. **User Update**: User components receive update and refresh data
5. **Notification**: Users see notification about the update

## Setup Instructions

### 1. Install Dependencies
```bash
cd DBT_Application
npm install
```

### 2. Start Socket Server
```bash
# Option 1: Direct command
npm start

# Option 2: Use batch script
start-socket-server.bat

# Option 3: Development mode with auto-restart
npm run dev
```

### 3. Verify Server
- Health check: http://localhost:3001/health
- Should show connected users count

### 4. Test System
- Run `test-socket-system.js` in browser console
- Check connection status in admin components
- Test real-time updates between admin and user pages

## Connection Status Indicators

### Admin Pages
- 🟢 **Live Updates Active**: Socket connected, real-time broadcasting enabled
- 🔴 **Offline Mode**: Socket disconnected, changes saved locally only

### User Pages  
- 🟢 **Live Updates**: Socket connected, receiving real-time updates
- 🟡 **Cached Data**: Socket disconnected, showing cached data with polling fallback

## Troubleshooting

### Socket Server Not Starting
1. Check if port 3001 is available
2. Ensure dependencies are installed: `npm install`
3. Check for error messages in console

### Connection Issues
1. Verify server is running: `http://localhost:3001/health`
2. Check browser console for connection errors
3. Ensure CORS is properly configured (already done)

### Real-time Updates Not Working
1. Check connection status indicators in UI
2. Verify both admin and user are on same localhost
3. Test with browser console: run `test-socket-system.js`

### Data Sync Issues
1. All data is stored in localStorage with consistent keys:
   - `notices`: Notice board data
   - `awarenessContent`: Awareness content data
2. Clear localStorage if data becomes corrupted
3. Refresh pages to reload data

## File Structure
```
DBT_Application/
├── socket-server.js              # Socket.IO server
├── package.json                  # Server dependencies
├── start-socket-server.bat       # Windows startup script
├── test-socket-system.js         # Test script
├── project/src/
│   ├── services/
│   │   ├── socketService.js      # Main socket client (USE THIS)
│   │   ├── websocketService.js   # Deprecated
│   │   └── realtimeSocketService.js # Deprecated
│   ├── hooks/
│   │   └── useRealtimeSocket.js  # Deprecated (compatibility wrapper)
│   └── pages/
│       ├── AdminNoticeBoard/     # Admin notice management
│       ├── NoticeBoard/          # User notice viewing
│       ├── AdminDashboard/AwarenessManagement/ # Admin content
│       └── UserAwareness/        # User content viewing
```

## Best Practices

1. **Always use `socketService.js`** - Other socket services are deprecated
2. **Check connection status** before sending updates
3. **Handle offline mode gracefully** with localStorage fallbacks
4. **Show connection indicators** to users
5. **Test real-time features** with multiple browser tabs/windows

## Security Notes

- Socket server only accepts connections from localhost (development)
- No authentication required for development environment
- All data validation happens on client side
- Production deployment would require proper authentication and HTTPS