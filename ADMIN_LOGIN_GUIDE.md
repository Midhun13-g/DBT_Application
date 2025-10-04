# Admin Login & Socket Testing Guide

## Admin Login Process

### 1. Start All Services
```bash
# Start all services (backend, frontend, socket)
start-all.bat

# OR start individually:
start-backend.bat
start-frontend.bat
start-socket-server.bat
```

### 2. Admin Login Credentials
- **Email:** admin@dbt.gov.in
- **Password:** admin123

### 3. Login Flow
1. Go to http://localhost:5173/login
2. Enter admin credentials
3. System will automatically:
   - Authenticate with backend API
   - Initialize socket connection
   - Redirect to `/admin` dashboard

## Socket Connection Testing

### Automatic Tests
The admin dashboard includes built-in socket testing:

1. **Header Status Indicator**
   - Green "Socket Connected" = Working
   - Red "Socket Disconnected" = Not working

2. **Socket Test Panel** (on overview page)
   - Click "Run Tests" button
   - Tests connection, messaging, and data sync

### Manual Testing
Run the socket test script:
```bash
admin-socket-test.bat
```

### Expected Results
✅ **Socket Connection:** Connected  
✅ **Connection Attempt:** Successfully connected  
✅ **Send Test Message:** Test message sent successfully  

## Troubleshooting

### Socket Not Connecting
1. Check if socket server is running on port 3001
2. Restart socket server: `start-socket-server.bat`
3. Check firewall settings for port 3001

### Admin Not Redirecting
1. Clear browser cache and localStorage
2. Check backend is running on port 8080
3. Verify admin credentials in database

### Cross-Browser Issues
1. Use network startup: `start-network-server.bat`
2. Access via IP address instead of localhost
3. Check CORS settings in backend and socket server

## Network Access
For cross-browser/device access:
- Frontend: http://YOUR_IP:5173/admin
- Backend: http://YOUR_IP:8080/api
- Socket: http://YOUR_IP:3001