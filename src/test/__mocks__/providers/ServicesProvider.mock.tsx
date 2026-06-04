import { ReactNode, useMemo } from 'react';

import { SchemaPipelineContext } from '@/contexts';

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

export const recordNormalizingService = {
  init: jest.fn(),
  get: jest.fn(),
} as IRecordNormalizingService;

export const recordToSchemaMappingService = {
  init: jest.fn(),
  get: jest.fn(),
} as IRecordToSchemaMappingService;

export const MockServicesProvider = ({ children }: { children: ReactNode }) => {
  const pipelineValue = useMemo(
    () => ({
      userValuesService,
      selectedEntriesService,
      schemaWithDuplicatesService,
      recordNormalizingService,
      recordToSchemaMappingService,
      recordGeneratorService: { generate: jest.fn() } as unknown as IRecordGeneratorService,
      schemaGeneratorService: { init: jest.fn(), get: jest.fn(), generate: jest.fn() } as ISchemaGeneratorService,
    }),
    [],
  );

  return (
    <SchemaPipelineContext.Provider value={pipelineValue as SchemaPipelineServices}>
      {children}
    </SchemaPipelineContext.Provider>
  );
};
