# Targeteer - Task Management Application

## Overview
Targeteer is a full-stack task management application built with Spring Boot (Java) backend and React (Vite) frontend. It features JWT authentication, role-based access control, task management, and bonus/reward system for employees.

## Project Structure
- `/targeteer` - Spring Boot backend application (Java 19)
- `/frontend` - React + Vite frontend application
- PostgreSQL database (Neon-backed Replit database)

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.5.7
- **Language**: Java 19 (GraalVM)
- **Database**: PostgreSQL with Flyway migrations
- **Security**: Spring Security with JWT authentication
- **Build Tool**: Maven
- **Port**: 8080 (localhost)

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.2
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Port**: 5000 (exposed to web)

## Database Schema
The application uses Flyway for database migrations. Schema includes:
- Users (with roles: ADMIN, MANAGER, WORKER)
- Tasks (with priorities and statuses)
- Bonuses (reward system)
- Manager-subordinate relationships

## Environment Configuration

### Database Configuration
The backend uses the following environment variables (automatically set by Replit):
- `PGHOST` - PostgreSQL host
- `PGPORT` - PostgreSQL port (5432)
- `PGDATABASE` - Database name
- `PGUSER` - Database user
- `PGPASSWORD` - Database password

### Running the Application

#### Frontend
The frontend runs automatically via the configured workflow:
```bash
cd frontend && npm run dev
```
Accessible at: https://<repl-domain>.replit.dev

#### Backend
The backend is started manually and runs in the background:
```bash
cd targeteer && java -jar target/targeteer-0.0.1-SNAPSHOT.jar
```

To rebuild the backend:
```bash
cd targeteer && mvn clean package -DskipTests
```

## Key Features
1. **Authentication System**
   - User registration and login
   - JWT token-based authentication
   - Role-based access control

2. **Task Management**
   - Create, assign, and track tasks
   - Task priorities and statuses
   - Free tasks pool for workers
   - Manager oversight of subordinate tasks

3. **Bonus System**
   - Managers can award bonuses
   - Bonus tracking and history
   - User bonus statistics

4. **User Management**
   - Admin user panel
   - Manager-subordinate hierarchy
   - Salary management
   - Role assignment

## API Endpoints
- `/api/auth/*` - Authentication endpoints
- `/api/task/*` - Task management
- `/api/user/*` - User operations
- `/api/manager/*` - Manager-specific operations
- `/api/bonus/*` - Bonus system

## Development Notes

### CORS Configuration
The backend is configured to accept requests from:
- `http://localhost:5173` (local development)
- `https://*.replit.dev` (Replit environment)

### Deployment Considerations
- Frontend must be on port 5000 for Replit webview
- Backend runs on localhost:8080 (not exposed externally)
- Database migrations run automatically on startup
- SSL is required for database connections

## Initial Setup (Completed)
- ✅ Java 19 and Node.js installed
- ✅ PostgreSQL database created and configured
- ✅ Database migrations applied
- ✅ Frontend dependencies installed
- ✅ Backend compiled and packaged
- ✅ CORS configured for Replit environment
- ✅ Vite configured for port 5000 with proper host settings
- ✅ Frontend workflow configured

## Recent Changes (November 27, 2025)
- Configured application for Replit environment
- Updated database configuration to use Replit PostgreSQL
- Fixed CORS settings to allow Replit domains
- Configured Vite to bind to 0.0.0.0:5000 for webview
- Set up frontend workflow on port 5000
- Updated Java version from 21 to 19 for compatibility

## Default Credentials
Check database migration V2__Add_admin.sql for initial admin credentials.
