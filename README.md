# DBT Status Tracking Application

## Quick Start Guide

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher

### Backend Setup (Spring Boot)
1. Navigate to backend directory:
   ```bash
   cd project_backend
   ```

2. Update database configuration in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/dbt_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. Start the backend:
   ```bash
   mvn spring-boot:run
   ```
   Or use the provided script: `start-backend.bat`

### Frontend Setup (React + Vite)
1. Navigate to frontend directory:
   ```bash
   cd project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend:
   ```bash
   npm run dev
   ```
   Or use the provided script: `start-frontend.bat`

### Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api
- Health Check: http://localhost:8080/api/test/health

### Default Login Credentials
- **Admin**: admin@dbt.gov.in / admin123
- **User**: user@example.com / password

### Features
- ✅ User Authentication & Authorization
- ✅ DBT Status Checking
- ✅ Camp Booking System
- ✅ Admin Dashboard with Analytics
- ✅ Multi-language Support (EN, HI, TA)
- ✅ Government Schemes Information
- ✅ Real-time Notifications
- ✅ Data Export & Reporting
- ✅ User Profile Management

### Troubleshooting
1. **Backend not starting**: Check MySQL connection and port 8080 availability
2. **Frontend not connecting**: Verify backend is running on port 8080
3. **CORS errors**: Backend includes CORS configuration for localhost:5173
4. **Database errors**: Ensure MySQL is running and database exists

### Project Structure
```
DBT_Application/
├── project/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utilities
├── project_backend/        # Spring Boot Backend
│   ├── src/main/java/     # Java source code
│   └── src/main/resources/ # Configuration files
└── README.md              # This file
```