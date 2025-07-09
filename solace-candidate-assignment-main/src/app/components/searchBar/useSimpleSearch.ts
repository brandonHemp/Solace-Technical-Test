import { useState, useCallback } from 'react';
import { Advocate } from '../../hooks/useAdvocates';
import { searchFields } from './utils';
import { buildApiUrl } from '../../hooks/utils';
import { useAuth } from '../../context/authContext';

interface UseSimpleSearchResult {
  searchResults: Advocate[];
  searchLoading: boolean;
  showDropdown: boolean;
  handleSearch: (query: string, cachedAdvocates?: Advocate[]) => void;
  clearSearchResults: () => void;
  setShowDropdown: (show: boolean) => void;
}

export const useSimpleSearch = (): UseSimpleSearchResult => {
  const auth = useAuth();
  const { filterAdvocatesByRole, user } = auth || {};

  const [searchResults, setSearchResults] = useState<Advocate[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchInCache = useCallback((query: string, cachedAdvocates: Advocate[]) => {
    const searchTerm = query.toLowerCase();
    const results = cachedAdvocates.filter(advocate =>
      searchFields.some(field => field.getValue(advocate).includes(searchTerm))
    );
    return results.slice(0, 10);
  }, []);

  const searchInDatabase = useCallback(async (query: string) => {
    setSearchLoading(true);
    try {
      const { url, headers } = buildApiUrl(
        { search: query },
        { field: 'firstName', direction: 'asc' },
        { page: 1, pageSize: 10 },
        user?.role || '',
        user?.username || ''
      );

      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        let filteredResults = result.data;
        if (filterAdvocatesByRole) {
          filteredResults = filterAdvocatesByRole(result.data);
        }
        return filteredResults;
      }
      throw new Error(result.message || 'Search failed');
    } catch (error) {
      console.error('Database search error:', error);
      return [];
    } finally {
      setSearchLoading(false);
    }
  }, [filterAdvocatesByRole, user]);

  const handleSearch = useCallback(async (query: string, cachedAdvocates: Advocate[] = []) => {
    if (query.length === 0) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    if (query.length <= 3) {
      // Use cache search for short queries
      const results = searchInCache(query, cachedAdvocates);
      setSearchResults(results);
      setShowDropdown(results.length > 0);
    } else {
      // Use database search for longer queries
      const results = await searchInDatabase(query);
      setSearchResults(results);
      setShowDropdown(results.length > 0);
    }
  }, [searchInCache, searchInDatabase]);

  const clearSearchResults = useCallback(() => {
    setSearchResults([]);
    setShowDropdown(false);
  }, []);

  return {
    searchResults,
    searchLoading,
    showDropdown,
    handleSearch,
    clearSearchResults,
    setShowDropdown
  };
}; 