import { ReactNode, useMemo } from 'react';

import { ServicesContext } from '@/contexts';

export const userValuesService = {
  set: jest.fn(),
  setValue: jest.fn(),
  getAllValues: jest.fn(),
  getValue: jest.fn(),
} as unknown as IUserValuesService;

export const selectedEntriesService = {
  get: jest.fn(),
  set: jest.fn(),
  addNew: jest.fn(),
  addDuplicated: jest.fn(),
  remove: jest.fn(),
} as unknown as ISelectedEntriesService;

export const schemaWithDuplicatesService = {
  get: jest.fn(),
  set: jest.fn(),
  duplicateEntry: jest.fn(),
} as unknown as ISchemaWithDuplicatesService;

export const lookupCacheService = {
  save: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
} as unknown as ILookupCacheService;

export const recordNormalizingService = {
  init: jest.fn(),
  get: jest.fn(),
} as IRecordNormalizingService;

export const recordToSchemaMappingService = {
  init: jest.fn(),
  get: jest.fn(),
} as IRecordToSchemaMappingService;

export const MockServicesProvider = ({ children }: { children: ReactNode }) => {
  const servicesValue = useMemo(
    () => ({
      userValuesService,
      selectedEntriesService,
      schemaWithDuplicatesService,
      lookupCacheService,
      recordNormalizingService,
      recordToSchemaMappingService,
    }),
    [],
  );

  return <ServicesContext.Provider value={servicesValue}>{children}</ServicesContext.Provider>;
};
