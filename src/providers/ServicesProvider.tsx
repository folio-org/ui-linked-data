import { FC } from 'react';
import { ServicesContext } from '@src/contexts';
import { SelectedEntriesService } from '@common/services/selectedEntries';
import { UserValuesService } from '@common/services/userValues';
import { apiClient } from '@common/api/client';
import { useLookupCacheService } from '@common/hooks/useLookupCache.hook';

type ServicesProviderProps = {
  children: ReactElement;
};

export const ServicesProvider: FC<ServicesProviderProps> = ({ children }) => {
  const lookupCacheService = useLookupCacheService();

  const selectedEntriesService = new SelectedEntriesService([]);
  const userValuesService = new UserValuesService({}, apiClient, lookupCacheService);

  return (
    <ServicesContext.Provider value={{ selectedEntriesService, userValuesService }}>
      {children}
    </ServicesContext.Provider>
  );
};
