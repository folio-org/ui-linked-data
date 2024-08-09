import { ReactNode } from 'react';
import { ServicesContext } from '@src/contexts';

export const MockServicesProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ServicesContext.Provider
      value={{
        userValuesService: {
          set: jest.fn(),
          setValue: jest.fn(),
          getAllValues: jest.fn(),
          getValue: jest.fn(),
        } as unknown as IUserValues,
        selectedEntriesService: {
          get: jest.fn(),
          set: jest.fn(),
          addNew: jest.fn(),
          addDuplicated: jest.fn(),
          remove: jest.fn(),
        } as unknown as ISelectedEntries,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};
