import { createContext } from 'react';

export const ServicesContext = createContext<ServicesParams>({
  selectedEntriesService: undefined,
  userValuesService: undefined,
  schemaWithDuplicatesService: undefined,
  lookupCacheService: undefined,
  recordNormalizingService: undefined,
  recordToSchemaMappingService: undefined,
  schemaGeneratorService: undefined,
  recordGeneratorService: undefined,
});
