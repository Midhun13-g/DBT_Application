# Network Access Setup Guide

## Quick Start for Cross-Browser Access

### 1. Start Network Servers
Run the network startup script:
```bash
start-network-server.bat
```

This will:
- Show your local IP address
- Start both backend and frontend servers
- Allow access from any browser on your network

### 2. Access from Different Browsers

**Same Computer:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api

**Different Computers/Browsers on Same Network:**
- Frontend: http://YOUR_IP_ADDRESS:5173
- Backend API: http://YOUR_IP_ADDRESS:8080/api

### 3. Manual Configuration

If you need to set a specific IP address:

1. Edit `project/.env` file:
```
VITE_API_URL=http://YOUR_IP_ADDRESS:8080/api
```

2. Start servers normally:
```bash
start-all.bat
```

### 4. Firewall Settings

If you can't access from other devices:
1. Allow ports 5173 and 8080 through Windows Firewall
2. Or temporarily disable Windows Firewall for testing

### 5. Troubleshooting

**Can't access from other browsers:**
- Check if Windows Firewall is blocking the ports
- Ensure both devices are on the same network
- Try accessing with the IP address instead of localhost

**CORS errors:**
- The backend is now configured to allow all origins
- Restart the backend server if you see CORS errors

**Database connection issues:**
- Make sure MySQL is running
- Check database credentials in application.properties