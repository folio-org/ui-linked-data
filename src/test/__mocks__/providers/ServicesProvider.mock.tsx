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

export const MockServicesProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ServicesContext.Provider
      value={{
        userValuesService,
        selectedEntriesService,
        schemaWithDuplicatesService,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};
