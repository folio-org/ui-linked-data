import { FC } from 'react';
import { ServicesContext } from '@src/contexts';
import { SelectedEntriesService } from '@common/services/selectedEntries';
import { UserValuesService } from '@common/services/userValues';
import { apiClient } from '@common/api/client';
import { useLookupCacheService } from '@common/hooks/useLookupCache.hook';
import { SchemaWithDuplicatesService } from '@common/services/schema';
import { RecordNormalizingService } from '@common/services/recordNormalizing';
import { RecordToSchemaMappingService } from '@common/services/recordToSchemaMapping';
import { useCommonStatus } from '@common/hooks/useCommonStatus';

type ServicesProviderProps = {
  children: ReactElement;
};

export const ServicesProvider: FC<ServicesProviderProps> = ({ children }) => {
  const lookupCacheService = useLookupCacheService();
  const commonStatusService = useCommonStatus();

  const selectedEntriesService = new SelectedEntriesService([]);
  const userValuesService = new UserValuesService({}, apiClient, lookupCacheService);
  const schemaWithDuplicatesService = new SchemaWithDuplicatesService({} as Schema, selectedEntriesService);
  const recordNormalizingService = new RecordNormalizingService();
  const recordToSchemaMappingService = new RecordToSchemaMappingService(
    selectedEntriesService,
    schemaWithDuplicatesService,
    userValuesService,
    commonStatusService,
  );

  return (
    <ServicesContext.Provider
      value={{
        selectedEntriesService,
        userValuesService,
        schemaWithDuplicatesService,
        lookupCacheService,
        recordNormalizingService,
        recordToSchemaMappingService,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};
