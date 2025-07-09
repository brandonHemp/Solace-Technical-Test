import { Advocate, AdvocateFilters, AdvocateSortOptions, PaginationOptions } from './useAdvocates';

export const buildApiUrl = (
  currentFilters: AdvocateFilters,
  currentSort: AdvocateSortOptions,
  currentPagination: PaginationOptions,
  currentUserRole: string,
  currentUsername: string
): { url: string; headers: Record<string, string> } => {
  const params = new URLSearchParams();

  const addParam = (key: string, value: unknown) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.append(key, value.join(','));
        }
      } else {
        params.append(key, String(value));
      }
    }
  };

  addParam('page', currentPagination.page);
  addParam('pageSize', currentPagination.pageSize);

  addParam('sortField', currentSort.field);
  addParam('sortDirection', currentSort.direction);

  const filterParams = [
    { key: 'search', value: currentFilters.search },
    { key: 'city', value: currentFilters.city },
    { key: 'degree', value: currentFilters.degree },
    { key: 'specialties', value: currentFilters.specialties },
    { key: 'minExperience', value: currentFilters.minExperience },
    { key: 'maxExperience', value: currentFilters.maxExperience }
  ];

  filterParams.forEach(({ key, value }) => addParam(key, value));

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-User-Role': currentUserRole,
    'X-Username': currentUsername
  };

  return {
    url: `/api/advocates?${params.toString()}`,
    headers
  };
}; 



export const searchFields = [
  {
    name: 'firstName',
    getValue: (advocate: Advocate) => advocate.firstName.toLowerCase()
  },
  {
    name: 'lastName', 
    getValue: (advocate: Advocate) => advocate.lastName.toLowerCase()
  },
  {
    name: 'city',
    getValue: (advocate: Advocate) => advocate.city.toLowerCase()
  },
  {
    name: 'degree',
    getValue: (advocate: Advocate) => advocate.degree.toLowerCase()
  },
  {
    name: 'specialties',
    getValue: (advocate: Advocate) => advocate.specialties.join(' ').toLowerCase()
  },
  {
    name: 'phoneNumber',
    getValue: (advocate: Advocate) => String((advocate as any).phoneNumber || '').toLowerCase()
  }
]; 