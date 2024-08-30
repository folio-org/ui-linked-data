import { ReactNode } from 'react';
import { ServicesContext } from '@src/contexts';

export const userValuesService = {
  set: jest.fn(),
  setValue: jest.fn(),
  getAllValues: jest.fn(),
  getValue: jest.fn(),
} as unknown as IUserValues;

export const selectedEntriesService = {
  get: jest.fn(),
  set: jest.fn(),
  addNew: jest.fn(),
  addDuplicated: jest.fn(),
  remove: jest.fn(),
} as unknown as ISelectedEntries;

export const schemaWithDuplicatesService = {
  get: jest.fn(),
  set: jest.fn(),
  duplicateEntry: jest.fn(),
} as unknown as ISchemaWithDuplicates;

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
} as IRecordToSchemaMapping;

export const schemaCreatorService = {
  init: jest.fn(),
  get: jest.fn(),
  generate: jest.fn(),
} as ISchema;

export const MockServicesProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ServicesContext.Provider
      value={{
        userValuesService,
        selectedEntriesService,
        schemaWithDuplicatesService,
        lookupCacheService,
        recordNormalizingService,
        recordToSchemaMappingService,
        schemaCreatorService,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};
