import type { Advocate } from "../../hooks/useAdvocates";

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