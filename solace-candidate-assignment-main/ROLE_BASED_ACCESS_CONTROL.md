# Role-Based Access Control for Solace Advocates

## Overview
This implementation provides role-based access control for the Solace Advocates application, allowing different user roles to see different sets of advocate data.

## User Roles

### 1. ADMIN
- **Access**: Can view all advocates
- **Description**: Full access to all advocate records
- **Username**: `admin_user`
- **Password**: `pw1234`

### 2. USER
- **Access**: Can view all advocates
- **Description**: Regular user with full advocate viewing permissions
- **Username**: `regular_user`
- **Password**: `pw1234`

### 3. ADVOCATE
- **Access**: Can only view advocates whose first name matches their username
- **Description**: Limited access based on name matching
- **Username**: `advocate_user`
- **Password**: `pw1234`

## Implementation Details

### AuthContext Features
The `authContext.tsx` file provides:
- `canViewAdvocate(advocate)` - Function to check if current user can view a specific advocate
- `filterAdvocatesByRole(advocates)` - Function to filter advocate arrays based on user role
- `isAdmin`, `isAdvocate`, `isUser` - Helper properties for role checking

### Role-Based Filtering Logic
```typescript
// Admin users can see all advocates
if (user.role === 'ADMIN') {
  return true;
}

// Advocate users can only see advocates with matching first name
if (user.role === 'ADVOCATE') {
  return advocate.firstName.toLowerCase() === user.username.toLowerCase() || 
         user.username.toLowerCase().includes(advocate.firstName.toLowerCase());
}

// Regular users can see all advocates
if (user.role === 'USER') {
  return true;
}
```

### Components Updated
1. **useAdvocates hook** - Applies role-based filtering to advocate data
2. **SearchBar component** - Filters search results based on user role
3. **Main page** - Shows role information and explanations
4. **Dashboard component** - Uses filtered advocate data

## Testing the Implementation

### 1. Admin User Testing
```
Username: admin_user
Password: pw1234
Expected: Should see all advocates (16 total)
```

### 2. Regular User Testing
```
Username: regular_user
Password: pw1234
Expected: Should see all advocates (16 total)
```

### 3. Advocate User Testing
```
Username: advocate_user
Password: pw1234
Expected: Should see only advocates with firstName "advocate" (1 total)
```

## Database Seed Data
The application includes seed data with:
- 15 regular advocates with various first names
- 1 advocate with firstName "advocate" (for testing advocate role)

## Key Features

### Frontend Filtering
- Role-based filtering is applied on the frontend for performance
- Search results are filtered based on user role
- Pagination works correctly with filtered data

### User Interface
- Role information is displayed in the header
- Role-specific explanations are shown to users
- Color-coded role indicators help identify access levels

### Security Considerations
- Authentication is handled through localStorage (demo purposes)
- Role information is stored in the user session
- All filtering is applied consistently across components

## Future Enhancements
1. Move role-based filtering to backend API endpoints
2. Implement JWT-based authentication
3. Add more granular permissions
4. Create admin interface for role management
5. Add audit logging for access control events

## Testing Commands
```bash
# Run the application
npm run dev

# Seed the database
npm run seed

# Test with different user roles by logging in with the provided credentials
```

## Notes
- The advocate user can see advocates whose firstName matches "advocate" 
- This is demonstrated with the seed data advocate "advocate Thompson"
- The matching logic uses case-insensitive string comparison
- All role checks are performed in the authContext for consistency 