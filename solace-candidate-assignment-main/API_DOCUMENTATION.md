# API Documentation

## Overview
This Next.js application provides several REST API endpoints with Docker containerization support.

## Getting Started with Docker

### Quick Start
```powershell
# Run the PowerShell start script
npm run docker:start

# Or manually:
docker-compose up --build -d
```

### Available Docker Commands
```powershell
npm run docker:build    # Build the Docker images
npm run docker:up       # Start containers in detached mode
npm run docker:down     # Stop and remove containers
npm run docker:logs     # View application logs
npm run docker:start    # Run the full start script
```

## API Endpoints

### Health Check
- **GET** `/api/health` - Check application health and status

### Users API
- **GET** `/api/users` - Get all users
- **POST** `/api/users` - Create a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```
- **PUT** `/api/users` - Update an existing user
  ```json
  {
    "id": 1,
    "name": "John Updated",
    "email": "john.updated@example.com"
  }
  ```
- **DELETE** `/api/users?id=1` - Delete a user by ID

### Tasks API
- **GET** `/api/tasks` - Get all tasks
- **POST** `/api/tasks` - Create a new task
  ```json
  {
    "title": "New Task",
    "description": "Task description",
    "completed": false
  }
  ```
- **PATCH** `/api/tasks` - Update task completion status
  ```json
  {
    "id": 1,
    "completed": true
  }
  ```
- **DELETE** `/api/tasks?id=1` - Delete a task by ID

### Existing Endpoints
- **GET** `/api/advocates` - Get advocates data
- **POST** `/api/seed` - Seed the database with advocate data

## Example Usage

### Test the Health Endpoint
```powershell
curl http://localhost:3000/api/health
```

### Create a New User
```powershell
curl -X POST http://localhost:3000/api/users `
  -H "Content-Type: application/json" `
  -d '{"name": "Alice Johnson", "email": "alice@example.com"}'
```

### Get All Tasks
```powershell
curl http://localhost:3000/api/tasks
```

### Update Task Status
```powershell
curl -X PATCH http://localhost:3000/api/tasks `
  -H "Content-Type: application/json" `
  -d '{"id": 1, "completed": true}'
```

## Services
- **Next.js App**: http://localhost:3000
- **PostgreSQL**: localhost:5432
  - Database: `solaceassignment`
  - Username: `postgres`
  - Password: `pw`

## Docker Configuration
The application runs in a multi-container setup:
- **app**: Next.js application container
- **postgres**: PostgreSQL database container
- **Network**: Both containers communicate through a bridge network

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Application environment (production in Docker)

## Monitoring
Use the health endpoint to monitor application status:
```powershell
curl http://localhost:3000/api/health
```

## Troubleshooting
- View application logs: `docker-compose logs -f app`
- View database logs: `docker-compose logs -f postgres`
- Restart services: `docker-compose restart`
- Rebuild containers: `docker-compose up --build` 