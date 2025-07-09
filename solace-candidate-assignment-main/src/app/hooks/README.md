# Hooks Documentation

This folder contains React hooks for managing advocates data, search functionality, and related utilities.

## Overview

The hooks in this folder provide a complete data management solution for advocates with the following features:
- **Data fetching** with pagination, filtering, and sorting
- **Role-based access control** for different user types
- **Search functionality** with both frontend cache and database search
- **Utility functions** for API URL construction and field definitions

## Files

### `useAdvocates.tsx`
The main hook for managing advocates data with comprehensive CRUD operations, filtering, sorting, and pagination.

### `useSearchAdvocates.tsx`
A specialized hook for search functionality that complements the main advocates hook.

### `utils.ts`
Utility functions and configurations shared across the hooks.

## Hooks Documentation

### `useAdvocates`

**Purpose**: Main hook for managing advocates data with full CRUD operations, filtering, sorting, and pagination.

**Key Features**:
- Server-side pagination, filtering, and sorting
- Role-based access control
- Comprehensive state management
- Error handling and loading states

**Usage**:
```typescript
import { useAdvocates } from './useAdvocates';

const MyComponent = () => {
  const {
    advocates,
    isLoading,
    pagination,
    filters,
    sortOptions,
    setPage,
    setFilters,
    setSortOptions,
    clearFilters,
    refresh
  } = useAdvocates(
    { page: 1, pageSize: 10 }, // Initial pagination
    { city: 'New York' },      // Initial filters
    { field: 'firstName', direction: 'asc' } // Initial sort
  );

  // Use the data and actions in your component
  return (
    <div>
      {/* Render advocates, pagination, filters, etc. */}
    </div>
  );
};
```

**Interface**:
```typescript
interface UseAdvocatesResult {
  // Data
  advocates: Advocate[];
  filteredAdvocates: Advocate[];
  paginatedAdvocates: Advocate[];
  totalCount: number;
  filteredCount: number;

  // Loading states
  isLoading: boolean;
  isError: boolean;
  error: string | null;

  // Pagination
  pagination: PaginationOptions;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;

  // Filtering & Sorting
  filters: AdvocateFilters;
  sortOptions: AdvocateSortOptions;

  // Actions
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setFilters: (filters: Partial<AdvocateFilters>) => void;
  clearFilters: () => void;
  setSortOptions: (sort: AdvocateSortOptions) => void;
  refresh: () => void;

  // Utility
  getAdvocateById: (id: number) => Advocate | undefined;
  getUniqueValues: (field: keyof Advocate) => string[];

  // Role-based access
  userRole: string | null;
  canViewAdvocate: (advocate: Advocate) => boolean;
}
```

### `useSearchAdvocates`

**Purpose**: Specialized hook for searching advocates with dual search modes (frontend cache and database).

**Key Features**:
- Frontend cache search for short queries (≤3 characters)
- Database search for longer queries (>3 characters)
- Dropdown management for search results
- Role-based filtering of search results

**Usage**:
```typescript
import { useSearchAdvocates } from './useSearchAdvocates';

const SearchComponent = () => {
  const {
    searchResults,
    searchLoading,
    showDropdown,
    handleSearch,
    clearSearchResults,
    setShowDropdown
  } = useSearchAdvocates();

  const handleInputChange = (query: string) => {
    // filteredAdvocates would come from useAdvocates hook
    handleSearch(query, filteredAdvocates);
  };

  return (
    <div>
      <input onChange={(e) => handleInputChange(e.target.value)} />
      {showDropdown && (
        <div>
          {searchResults.map(advocate => (
            <div key={advocate.id}>{advocate.firstName} {advocate.lastName}</div>
          ))}
        </div>
      )}
    </div>
  );
};
```

**Interface**:
```typescript
interface UseSearchAdvocatesResult {
  // State
  searchResults: Advocate[];
  searchLoading: boolean;
  showDropdown: boolean;

  // Actions
  searchInFrontendCache: (query: string, filteredAdvocates: Advocate[]) => void;
  searchAdvocatesInDatabase: (query: string) => Promise<void>;
  handleSearch: (query: string, filteredAdvocates: Advocate[]) => void;
  clearSearchResults: () => void;
  setShowDropdown: (show: boolean) => void;
}
```

### `utils.ts`

**Purpose**: Utility functions and configurations shared across the hooks.

**Functions**:

#### `buildApiUrl`
Constructs API URLs with proper query parameters for filtering, sorting, and pagination.

```typescript
const { url, headers } = buildApiUrl(
  filters,           // AdvocateFilters
  sortOptions,       // AdvocateSortOptions
  pagination,        // PaginationOptions
  userRole,          // string
  username           // string
);
```

#### `searchFields`
Configuration array defining searchable fields for frontend cache search.

```typescript
const searchFields = [
  { name: 'firstName', getValue: (advocate) => advocate.firstName.toLowerCase() },
  { name: 'lastName', getValue: (advocate) => advocate.lastName.toLowerCase() },
  { name: 'city', getValue: (advocate) => advocate.city.toLowerCase() },
  { name: 'degree', getValue: (advocate) => advocate.degree.toLowerCase() },
  { name: 'specialties', getValue: (advocate) => advocate.specialties.join(' ').toLowerCase() },
  { name: 'phoneNumber', getValue: (advocate) => String(advocate.phoneNumber || '').toLowerCase() }
];
```

## Data Types

### Core Interfaces

```typescript
interface Advocate {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
  createdAt?: string;
}

interface AdvocateFilters {
  search?: string;
  city?: string;
  degree?: string;
  specialties?: string[];
  minExperience?: number;
  maxExperience?: number;
  userrole?: string;
}

interface AdvocateSortOptions {
  field: keyof Advocate;
  direction: 'asc' | 'desc';
}

interface PaginationOptions {
  page: number;
  pageSize: number;
}
```

## Usage Patterns

### Basic Data Fetching
```typescript
const { advocates, isLoading, isError } = useAdvocates();
```

### With Initial Configuration
```typescript
const advocatesHook = useAdvocates(
  { page: 1, pageSize: 20 },
  { city: 'Toronto', minExperience: 5 },
  { field: 'yearsOfExperience', direction: 'desc' }
);
```

### Combined with Search
```typescript
const advocatesHook = useAdvocates();
const searchHook = useSearchAdvocates();

const handleSearch = (query: string) => {
  searchHook.handleSearch(query, advocatesHook.filteredAdvocates);
};
```

## Authentication Requirements

Both hooks require authentication context from `../context/authContext`:
- User must be logged in for hooks to function
- Role-based access control is applied to all data
- User role and username are passed to API calls

## Error Handling

- All hooks include comprehensive error handling
- Loading states are provided for UI feedback
- Errors are logged to console and exposed via hook state
- Graceful fallbacks when role-based filtering fails

## Performance Considerations

- **Frontend Cache Search**: Used for short queries (≤3 characters) to reduce API calls
- **Database Search**: Used for longer queries (>3 characters) for comprehensive results
- **Pagination**: Server-side pagination reduces data transfer
- **Memoization**: Results are memoized to prevent unnecessary re-renders
- **Debouncing**: Consider implementing debouncing for search inputs in your components

## Dependencies

- React hooks (`useState`, `useEffect`, `useCallback`, `useMemo`)
- Authentication context (`../context/authContext`)
- Search utilities (`../components/searchBar/utils`) 