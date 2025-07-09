import { useState, useEffect, useCallback, useMemo } from 'react';
import { buildApiUrl } from './utils';
import { useAuth } from '../context/authContext';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Advocate {
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

export interface AdvocateFilters {
  search?: string;
  city?: string;
  degree?: string;
  specialties?: string[];
  minExperience?: number;
  maxExperience?: number;
  userrole?: string;
}

export interface AdvocateSortOptions {
  field: keyof Advocate;
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

interface AdvocatesState {
  rawAdvocates: Advocate[];
  totalCount: number;
  filteredCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  isInitialized: boolean;
}

export interface UseAdvocatesResult {
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

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_PAGINATION: PaginationOptions = {
  page: 1,
  pageSize: 10
};

const DEFAULT_SORT: AdvocateSortOptions = {
  field: 'firstName',
  direction: 'asc'
};

const INITIAL_STATE: AdvocatesState = {
  rawAdvocates: [],
  totalCount: 0,
  filteredCount: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
  isLoading: false,
  isError: false,
  error: null,
  isInitialized: false,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const createEmptyResult = (): UseAdvocatesResult => ({
  // Data - empty states
  advocates: [],
  filteredAdvocates: [],
  paginatedAdvocates: [],
  totalCount: 0,
  filteredCount: 0,

  // Loading states
  isLoading: false,
  isError: false,
  error: null,

  // Pagination
  pagination: DEFAULT_PAGINATION,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,

  // Filtering & Sorting
  filters: {},
  sortOptions: DEFAULT_SORT,

  // Actions - no-op functions when user is not available
  setPage: () => {},
  setPageSize: () => {},
  nextPage: () => {},
  previousPage: () => {},
  setFilters: () => {},
  clearFilters: () => {},
  setSortOptions: () => {},
  refresh: () => {},

  // Utility
  getAdvocateById: () => undefined,
  getUniqueValues: () => [],

  // Role-based access
  userRole: null,
  canViewAdvocate: () => false,
});

// ============================================================================
// MAIN HOOK
// ============================================================================

export const useAdvocates = (
  initialPagination: Partial<PaginationOptions> = {},
  initialFilters: AdvocateFilters = {},
  initialSort: Partial<AdvocateSortOptions> = {}
): UseAdvocatesResult => {

  const auth = useAuth();
  const { user, filterAdvocatesByRole, canViewAdvocate } = auth || {};

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [state, setState] = useState<AdvocatesState>(INITIAL_STATE);
  
  const [pagination, setPagination] = useState<PaginationOptions>({
    ...DEFAULT_PAGINATION,
    ...initialPagination
  });

  const [filters, setFiltersState] = useState<AdvocateFilters>(initialFilters);
  const [sortOptions, setSortOptionsState] = useState<AdvocateSortOptions>({
    ...DEFAULT_SORT,
    ...initialSort
  });

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const advocates = useMemo(() => {
    if (!user || !filterAdvocatesByRole) return state.rawAdvocates;
    try {
      return filterAdvocatesByRole(state.rawAdvocates);
    } catch (error) {
      console.error('Error filtering advocates by role:', error);
      return state.rawAdvocates;
    }
  }, [state.rawAdvocates, user, filterAdvocatesByRole]);

  // For backward compatibility - return the same data as filtered and paginated
  const filteredAdvocates = useMemo(() => advocates, [advocates]);
  const paginatedAdvocates = useMemo(() => advocates, [advocates]);

  // ============================================================================
  // API HELPERS
  // ============================================================================

  const handleApiResponse = useCallback(async (response: Response) => {

    if (!response.ok) {
      return null;
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch advocates');
    }

    return result;
  }, []);

  const updateStateWithResults = useCallback((result: any) => {
    setState(prev => ({
      ...prev,
      rawAdvocates: result.data,
      totalCount: result.totalCount,
      filteredCount: result.filteredCount,
      totalPages: result.pagination.totalPages,
      hasNextPage: result.pagination.hasNextPage,
      hasPreviousPage: result.pagination.hasPreviousPage,
    }));
  }, []);

  const handleFetchError = useCallback((err: unknown) => {
    setState(prev => ({
      ...prev,
      isError: true,
      error: err instanceof Error ? err.message : 'An unknown error occurred',
    }));
    console.error('Error fetching advocates:', err);
  }, []);

  // ============================================================================
  // MAIN FETCH FUNCTION
  // ============================================================================

  const fetchAdvocates = useCallback(async (
    currentFilters?: AdvocateFilters,
    currentSort?: AdvocateSortOptions,
    currentPagination?: PaginationOptions
  ) => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      isError: false,
      error: null,
    }));

    try {
      const mergedFilters = currentFilters || filters;
      const mergedSort = currentSort || sortOptions;
      const mergedPagination = currentPagination || pagination;

      const { url, headers } = buildApiUrl(
        mergedFilters, 
        mergedSort, 
        mergedPagination, 
        user?.role || '', 
        user?.username || ''
      );

      const response = await fetch(url, { headers });
      const result = await handleApiResponse(response);

      if (result) {
        updateStateWithResults(result);
      }
    } catch (err) {
      handleFetchError(err);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [filters, sortOptions, pagination, handleApiResponse, updateStateWithResults, handleFetchError, user]);

  // ============================================================================
  // ACTION HANDLERS
  // ============================================================================

  // const createPaginationHandler = useCallback((
  //   updater: (prev: PaginationOptions) => PaginationOptions,
  //   logMessage: string
  // ) => {
  //   return () => {
  //     console.log(logMessage);
  //     const newPagination = updater(pagination);
  //     setPagination(newPagination);
  //     fetchAdvocates(filters, sortOptions, newPagination);
  //   };
  // }, [pagination, filters, sortOptions, fetchAdvocates]);


  const setPage = useCallback((page: number) => {

    const newPagination = { ...pagination, page };
    setPagination(newPagination);
    fetchAdvocates(filters, sortOptions, newPagination);
  }, [pagination, filters, sortOptions, fetchAdvocates]);


  const setPageSize = useCallback((pageSize: number) => {

    const newPagination = {
      ...pagination,
      pageSize: Math.max(1, pageSize),
      page: 1 // Reset to first page when changing page size
    };
    setPagination(newPagination);
    fetchAdvocates(filters, sortOptions, newPagination);
  }, [pagination, filters, sortOptions, fetchAdvocates]);


  const nextPage = useCallback(() => {

    if (state.hasNextPage) {
      setPage(pagination.page + 1);
    }
  }, [state.hasNextPage, setPage, pagination.page]);


  const previousPage = useCallback(() => {

    if (state.hasPreviousPage) {
      setPage(pagination.page - 1);
    }
  }, [state.hasPreviousPage, setPage, pagination.page]);


  const setFilters = useCallback((newFilters: Partial<AdvocateFilters>) => {

    const updatedFilters = { ...filters, ...newFilters };
    const newPagination = { ...pagination, page: 1 }; // Reset to first page when filters change

    setFiltersState(updatedFilters);
    setPagination(newPagination);
    fetchAdvocates(updatedFilters, sortOptions, newPagination);
  }, [filters, pagination, sortOptions, fetchAdvocates]);

  const clearFilters = useCallback(() => {

    const newPagination = { ...pagination, page: 1 };
    setFiltersState({});
    setPagination(newPagination);
    fetchAdvocates({}, sortOptions, newPagination);
  }, [pagination, sortOptions, fetchAdvocates]);

  const setSortOptions = useCallback((sort: AdvocateSortOptions) => {

    const newPagination = { ...pagination, page: 1 };
    setSortOptionsState(sort);
    setPagination(newPagination);
    fetchAdvocates(filters, sort, newPagination);
  }, [filters, pagination, fetchAdvocates]);

  const refresh = useCallback(() => {

    fetchAdvocates(filters, sortOptions, pagination);
  }, [filters, sortOptions, pagination, fetchAdvocates]);

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const getAdvocateById = useCallback((id: number) => {

    return advocates.find(advocate => advocate.id === id);
  }, [advocates]);

  const getUniqueValues = useCallback((field: keyof Advocate) => {

    // Note: This now only works with the current page data
    const values = advocates.map(advocate => {
      const value = advocate[field];
      if (Array.isArray(value)) {
        return value;
      }
      return String(value);
    });

    const flatValues = values.flat();
    return [...new Set(flatValues)].sort();
  }, [advocates]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Initialize data fetch only once when component mounts and user is available
  useEffect(() => {
    
    if (user && !state.isInitialized) {
      setState(prev => ({ ...prev, isInitialized: true }));
      fetchAdvocates();
    }
  }, [user, state.isInitialized, fetchAdvocates]);

  // ============================================================================
  // EARLY RETURN FOR UNAUTHORIZED ACCESS
  // ============================================================================

  // Early return if user is not available - prevents hook from functioning
  if (!user) {
    return createEmptyResult();
  }

  // ============================================================================
  // RETURN HOOK RESULT
  // ============================================================================

  return {
    // Data
    advocates,
    filteredAdvocates,
    paginatedAdvocates,
    totalCount: state.totalCount,
    filteredCount: state.filteredCount,

    // Loading states
    isLoading: state.isLoading,
    isError: state.isError,
    error: state.error,

    // Pagination
    pagination,
    totalPages: state.totalPages,
    hasNextPage: state.hasNextPage,
    hasPreviousPage: state.hasPreviousPage,

    // Filtering & Sorting
    filters,
    sortOptions,

    // Actions
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    setFilters,
    clearFilters,
    setSortOptions,
    refresh,

    // Utility
    getAdvocateById,
    getUniqueValues,

    // Role-based access
    userRole: user.role || null,
    canViewAdvocate: canViewAdvocate || (() => true),
  };
};
