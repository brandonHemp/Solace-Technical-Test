# Mental Health Advocates Platform API

A comprehensive Next.js API platform for managing mental health advocates with role-based access control, advanced search capabilities, and caching optimization.

## 🚀 Features

- **Role-Based Access Control**: Support for ADMIN, USER, and ADVOCATE roles
- **Advanced Search & Filtering**: Search advocates by name, city, degree, specialties, and experience
- **Pagination & Sorting**: Efficient data retrieval with customizable pagination and sorting
- **In-Memory Caching**: 5-minute TTL cache for improved performance
- **Database Integration**: PostgreSQL with Drizzle ORM
- **Authentication**: Username/password authentication with login tracking
- **Health Monitoring**: Built-in health check endpoint
- **Task Management**: CRUD operations for task management
- **User Management**: Complete user lifecycle management

## 📋 API Endpoints

### Authentication

#### POST `/api/login`
Authenticate users and track login attempts.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "role": "ADMIN",
    "numberOfLogins": 5,
    "dateCreated": "2024-01-01T00:00:00.000Z",
    "dateUpdated": "2024-01-01T00:00:00.000Z"
  },
  "message": "Login successful"
}
```

### Advocates

#### GET `/api/advocates`
Retrieve advocates with advanced filtering, sorting, and pagination.

**Query Parameters:**
- `search` (string): Search across name, city, degree, specialties
- `city` (string): Filter by city
- `degree` (string): Filter by degree
- `specialties` (string): Comma-separated list of specialties
- `minExperience` (number): Minimum years of experience
- `maxExperience` (number): Maximum years of experience
- `sortField` (string): Field to sort by (default: `firstName`)
- `sortDirection` (string): `asc` or `desc` (default: `asc`)
- `page` (number): Page number (default: 1)
- `pageSize` (number): Items per page (default: 10, max: 100)

**Headers:**
- `X-Username` (required): Username for role-based filtering

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "city": "New York",
      "degree": "MD",
      "specialties": ["General Mental Health", "Anxiety", "Depression"],
      "yearsOfExperience": 10,
      "phoneNumber": 5551234567,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalCount": 50,
  "filteredCount": 50,
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "message": "Advocates retrieved successfully"
}
```

#### GET `/api/advocates/search`
Search advocates with simplified query interface.

**Query Parameters:**
- `query` (string): Search term (minimum 4 characters)
- `limit` (number): Maximum results (default: 10)
- `topFive` (boolean): Get top 5 advocates by specialty count
- `userrole` (string): User role for filtering
- `username` (string): Username for role-based filtering

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "city": "New York",
      "degree": "MD",
      "specialties": ["General Mental Health", "Anxiety", "Depression"],
      "yearsOfExperience": 10,
      "phoneNumber": 5551234567
    }
  ],
  "message": "Search completed successfully"
}
```

### Users

#### GET `/api/users`
Retrieve all users (admin only).

#### POST `/api/users`
Create a new user.

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "role": "ADMIN" | "USER" | "ADVOCATE"
}
```

#### PUT `/api/users`
Update an existing user.

**Request Body:**
```json
{
  "id": 1,
  "username": "string",
  "password": "string (optional)",
  "role": "ADMIN" | "USER" | "ADVOCATE"
}
```

#### DELETE `/api/users?id=1`
Delete a user by ID.

### Tasks

#### GET `/api/tasks`
Retrieve all tasks.

#### POST `/api/tasks`
Create a new task.

**Request Body:**
```json
{
  "title": "string",
  "description": "string (optional)",
  "completed": false
}
```

#### PATCH `/api/tasks`
Update task completion status.

**Request Body:**
```json
{
  "id": 1,
  "completed": true
}
```

#### DELETE `/api/tasks?id=1`
Delete a task by ID.

### Health Check

#### GET `/api/health`
System health and status information.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "environment": "development",
  "database": {
    "connected": true,
    "url": "configured"
  }
}
```

### Database Seeding

#### POST `/api/seed`
Seed the database with advocate data.

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Environment Variables
Create a `.env.local` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
NODE_ENV=development
```

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd solace-candidate-assignment-main
```

2. **Install dependencies**
```bash
npm install
```

3. A. **Set up the db Brandon's way**
```bash
# This command runs everything.
npm db:full:enchilada
```

3. **Set up the database**
```bash
# Run database migrations
npx drizzle-kit migrate

# Seed the database (optional)
curl -X POST http://localhost:3000/api/seed
```

4. **Start the development server**
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 🔐 Authentication & Authorization

### User Roles

1. **ADMIN**: Full access to all advocates and system features
2. **USER**: Can view all advocates
3. **ADVOCATE**: Can only view their own profile (filtered by firstName matching username)

### Authentication Flow

1. Send POST request to `/api/login` with username and password
2. Receive user data including role information
3. Include `X-Username` header in subsequent requests for role-based filtering

## 🎯 Role-Based Access Control

### Advocates API (`/api/advocates`)
- **ADMIN**: Can view all advocates
- **ADVOCATE**: Can only view advocates with matching firstName
- Uses `X-Username` header for filtering

### Search API (`/api/advocates/search`)
- **ADMIN**: Can search all advocates
- **ADVOCATE**: Search results filtered to matching firstName
- Uses `userrole` and `username` query parameters

## 📊 Caching Strategy

The advocates API implements in-memory caching with:
- **TTL**: 5 minutes
- **Cache Key**: Based on filters, sort options, pagination, and user context
- **Auto-Cleanup**: Expired entries are automatically removed
- **Performance**: Significantly reduces database load for repeated queries

## 🗄️ Database Schema

### Users Table
- `id` (Primary Key)
- `username` (Unique)
- `password`
- `role` (ADMIN | USER | ADVOCATE)
- `numberOfLogins`
- `dateCreated`
- `dateUpdated`

### Advocates Table
- `id` (Primary Key)
- `firstName`
- `lastName`
- `city`
- `degree`
- `specialties` (JSON Array)
- `yearsOfExperience`
- `phoneNumber`
- `createdAt`

## 🔍 Search Capabilities

### Full-Text Search
The search functionality supports:
- **Name Search**: firstName and lastName
- **Location Search**: city
- **Qualification Search**: degree
- **Specialty Search**: JSON array of specialties
- **Experience Range**: minExperience to maxExperience

### Sorting Options
Available sort fields:
- `firstName`, `lastName`
- `city`, `degree`
- `yearsOfExperience`
- `phoneNumber`, `createdAt`
- `specialtyCount` (calculated field)

## 🚨 Error Handling

The API implements comprehensive error handling:
- **400 Bad Request**: Invalid input parameters
- **401 Unauthorized**: Authentication failed
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Database or system errors

All errors return consistent JSON structure:
```json
{
  "success": false,
  "message": "Error description",
  "error": "detailed error (development only)"
}
```

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Login Test
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "test_user", "password": "password123"}'
```

### Search Test
```bash
curl "http://localhost:3000/api/advocates/search?query=john&userrole=ADMIN&username=admin"
```

## 📈 Performance Optimizations

1. **Database Indexing**: Proper indexes on frequently queried fields
2. **In-Memory Caching**: Reduces database load for repeated queries
3. **Pagination**: Efficient data retrieval with LIMIT/OFFSET
4. **Connection Pooling**: Optimized database connections
5. **Query Optimization**: Efficient SQL queries with Drizzle ORM

## 🔧 Development Tools

- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Runtime**: Next.js 13+ App Router
- **TypeScript**: Full type safety
- **Validation**: Runtime parameter validation

## 📄 License

This project is part of a candidate assignment for Solace.

## 🤝 Contributing

This is a candidate assignment project. Please follow the provided specifications and requirements.

---

For questions or support, please contact the development team.

