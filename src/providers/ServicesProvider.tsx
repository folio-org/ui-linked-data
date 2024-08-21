import { FC } from 'react';
import { ServicesContext } from '@src/contexts';
import { SelectedEntriesService } from '@common/services/selectedEntries';
import { UserValuesService } from '@common/services/userValues';
import { apiClient } from '@common/api/client';
import { useLookupCacheService } from '@common/hooks/useLookupCache.hook';
import { SchemaWithDuplicatesService } from '@common/services/schema';

type ServicesProviderProps = {
  children: ReactElement;
};

export const ServicesProvider: FC<ServicesProviderProps> = ({ children }) => {
  const lookupCacheService = useLookupCacheService();

  const selectedEntriesService = new SelectedEntriesService([]);
  const userValuesService = new UserValuesService({}, apiClient, lookupCacheService);
  const schemaWithDuplicatesService = new SchemaWithDuplicatesService({} as Schema, selectedEntriesService);

  return (
    <ServicesContext.Provider
      value={{ selectedEntriesService, userValuesService, schemaWithDuplicatesService, lookupCacheService }}
    >
      {children}
    </ServicesContext.Provider>
  );
};
