import { createContext } from 'react';

export const ServicesContext = createContext<ServicesParams>({
  selectedEntriesService: undefined,
  userValuesService: undefined,
  schemaWithDuplicatesService: undefined,
});
