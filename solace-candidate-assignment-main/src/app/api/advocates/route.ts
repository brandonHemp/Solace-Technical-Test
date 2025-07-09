import { NextRequest, NextResponse } from 'next/server';
import { advocates, users } from '../../../db/schema';
import { withDbConnection } from '../../../db/connection';
import { ilike, and, gte, lte, desc, asc, sql, eq } from 'drizzle-orm';

// Types
interface AdvocateFilters {
  search?: string;
  city?: string;
  degree?: string;
  specialties?: string[];
  minExperience?: number;
  maxExperience?: number;
}

interface AdvocateSortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

interface PaginationOptions {
  page: number;
  pageSize: number;
}

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

interface UserContext {
  role: 'ADMIN' | 'USER' | 'ADVOCATE' | undefined;
  username: string | undefined;
}

interface QueryResult {
  data: any[];
  totalCount: number;
  filteredCount: number;
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// In-memory cache
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// ======================
// CACHE UTILITIES
// ======================

const getCacheKey = (
  filters: AdvocateFilters,
  sort: AdvocateSortOptions,
  pagination: PaginationOptions,
  userContext: UserContext
): string => {
  return JSON.stringify({ filters, sort, pagination, userContext });
};

const isValidCache = (entry: CacheEntry): boolean => {
  return Date.now() - entry.timestamp < entry.ttl;
};

const getFromCache = (key: string): any | null => {
  const entry = cache.get(key);
  if (entry && isValidCache(entry)) {
    return entry.data;
  }
  if (entry) {
    cache.delete(key); // Remove expired entry
  }
  return null;
};

const setCache = (key: string, data: any, ttl: number = CACHE_TTL): void => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
};

// ======================
// PARAMETER PARSING
// ======================

const parseFilters = (searchParams: URLSearchParams): AdvocateFilters => {
  return {
    search: searchParams.get('search') || undefined,
    city: searchParams.get('city') || undefined,
    degree: searchParams.get('degree') || undefined,
    specialties: searchParams.get('specialties')?.split(',').filter(Boolean) || undefined,
    minExperience: searchParams.get('minExperience') ? parseInt(searchParams.get('minExperience')!) : undefined,
    maxExperience: searchParams.get('maxExperience') ? parseInt(searchParams.get('maxExperience')!) : undefined,
  };
};

const parseSortOptions = (searchParams: URLSearchParams): AdvocateSortOptions => {
  return {
    field: searchParams.get('sortField') || 'firstName',
    direction: (searchParams.get('sortDirection') as 'asc' | 'desc') || 'asc'
  };
};

const parsePagination = (searchParams: URLSearchParams): PaginationOptions => {
  return {
    page: Math.max(1, parseInt(searchParams.get('page') || '1')),
    pageSize: Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '10')))
  };
};

// ======================
// USER VALIDATION
// ======================

const validateAndGetUserContext = async (username: string): Promise<UserContext> => {
  if (!username) {
    throw new Error('Username is required');
  }

  const clientUser = await withDbConnection(async (db) => {
    const userQuery = await db
      .select({
        role: users.role,
        username: users.username
      })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    return userQuery[0] || null;
  });

  if (!clientUser) {
    throw new Error('User not found');
  }

  return {
    role: clientUser.role,
    username: clientUser.username
  };
};

// ======================
// QUERY BUILDING
// ======================

const buildRoleBasedConditions = (userRole: UserContext['role'], username: UserContext['username']) => {
  const conditions = [];

  if (userRole === 'ADVOCATE' && username) {
    // For advocate users, filter to only show advocates with matching first name
    conditions.push(ilike(advocates.firstName, username));
  }
  // ADMIN users can see all advocates (no additional conditions)

  return conditions;
};

const buildSearchConditions = (filters: AdvocateFilters) => {
  const conditions = [];

  if (filters.search) {
    const searchTerm = `%${filters.search}%`;
    conditions.push(
      sql`(${advocates.firstName} ILIKE ${searchTerm} OR ${advocates.lastName} ILIKE ${searchTerm} OR ${advocates.city} ILIKE ${searchTerm} OR ${advocates.degree} ILIKE ${searchTerm})`
    );
  }

  if (filters.city) {
    conditions.push(ilike(advocates.city, `%${filters.city}%`));
  }

  if (filters.degree) {
    conditions.push(ilike(advocates.degree, `%${filters.degree}%`));
  }

  if (filters.specialties && filters.specialties.length > 0) {
    const specialtyConditions = filters.specialties.map(specialty =>
      sql`${advocates.specialties}::text ILIKE ${`%${specialty}%`}`
    );
    conditions.push(sql`(${sql.join(specialtyConditions, sql` OR `)})`);
  }

  if (filters.minExperience !== undefined) {
    conditions.push(gte(advocates.yearsOfExperience, filters.minExperience));
  }

  if (filters.maxExperience !== undefined) {
    conditions.push(lte(advocates.yearsOfExperience, filters.maxExperience));
  }

  return conditions;
};

const getSortField = (field: string) => {
  const fieldMapping: Record<string, any> = {
    firstName: advocates.firstName,
    lastName: advocates.lastName,
    city: advocates.city,
    degree: advocates.degree,
    yearsOfExperience: advocates.yearsOfExperience,
    phoneNumber: advocates.phoneNumber,
    createdAt: advocates.createdAt,
    id: advocates.id,
    specialtyCount: sql`
      CASE 
        WHEN jsonb_typeof(${advocates.specialties}) = 'array' 
        THEN jsonb_array_length(${advocates.specialties}) 
        ELSE 0 
      END
    `
  };
  return fieldMapping[field] || advocates.firstName;
};

const applyFallbackRoleFiltering = (advocateData: any[], userRole: UserContext['role'], username: UserContext['username']) => {
  if (userRole === 'ADMIN') {
    return advocateData;
  }

  if (userRole === 'ADVOCATE' && username) {
    return advocateData.filter(advocate =>
      advocate.firstName.toLowerCase() === username.toLowerCase()
    );
  }

  return advocateData;
};

// ======================
// DATABASE OPERATIONS
// ======================

const queryAdvocates = async (
  filters: AdvocateFilters,
  sort: AdvocateSortOptions,
  pagination: PaginationOptions,
  userContext: UserContext
): Promise<QueryResult> => {
  return await withDbConnection(async (db) => {
    // Build WHERE conditions
    const whereConditions = [
      ...buildRoleBasedConditions(userContext?.role, userContext?.username),
      ...buildSearchConditions(filters)
    ];
    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Get total count
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(advocates)
      .where(whereClause);

    const totalCount = Number(totalCountResult[0]?.count || 0);

    // Get sorted and paginated results
    const orderByClause = sort.direction === 'asc'
      ? asc(getSortField(sort.field))
      : desc(getSortField(sort.field));
    const offset = (pagination.page - 1) * pagination.pageSize;

    const advocateData = await db
      .select({
        id: advocates.id,
        firstName: advocates.firstName,
        lastName: advocates.lastName,
        city: advocates.city,
        degree: advocates.degree,
        specialties: advocates.specialties,
        yearsOfExperience: advocates.yearsOfExperience,
        phoneNumber: advocates.phoneNumber,
        createdAt: advocates.createdAt,
      })
      .from(advocates)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(pagination.pageSize)
      .offset(offset);

    const totalPages = Math.ceil(totalCount / pagination.pageSize);
    const hasNextPage = pagination.page < totalPages;
    const hasPreviousPage = pagination.page > 1;

    // Apply fallback role filtering
    const filteredData = applyFallbackRoleFiltering(advocateData, userContext?.role, userContext.username);

    return {
      data: filteredData,
      totalCount,
      filteredCount: totalCount,
      pagination: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages,
        hasNextPage,
        hasPreviousPage
      }
    };
  });
};

// ======================
// ERROR HANDLING
// ======================

const createErrorResponse = (message: string, status: number = 500, error?: any) => {
  console.error('API Error:', error);
  return NextResponse.json({
    success: false,
    message,
    error: error?.message || error
  }, { status });
};

const createSuccessResponse = (data: any, fromCache: boolean = false) => {
  return NextResponse.json({
    success: true,
    ...data,
    message: `Advocates retrieved successfully from ${fromCache ? 'cache' : 'database'}`
  });
};

// ======================
// MAIN HANDLER
// ======================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = parseFilters(searchParams);
    const sort = parseSortOptions(searchParams);
    const pagination = parsePagination(searchParams);
    
    const username = request.headers.get('X-Username') || '';
    
    if (!username) {
      return NextResponse.json({
        success: false,
        message: 'Username is required'
      }, { status: 401 });
    }

    const userContext = await validateAndGetUserContext(username);
    
    const cacheKey = getCacheKey(filters, sort, pagination, userContext);
    const cachedResult = getFromCache(cacheKey);
    
    if (cachedResult) {
      return createSuccessResponse(cachedResult, true);
    }
    
    const result = await queryAdvocates(filters, sort, pagination, userContext);
    
    setCache(cacheKey, result);
    
    return createSuccessResponse(result, false);
    
  } catch (error: any) {
    if (error.message === 'Username is required') {
      return createErrorResponse('Username is required', 401);
    }
    if (error.message === 'User not found') {
      return createErrorResponse('User not found', 404);
    }
    return createErrorResponse('Database error', 500, error);
  }
}
