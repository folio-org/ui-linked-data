import { FC } from 'react';
import { ServicesContext } from '@src/contexts';
import { SelectedEntriesService } from '@common/services/selectedEntries';
import { UserValuesService } from '@common/services/userValues';
import { apiClient } from '@common/api/client';
import { useLookupCacheService } from '@common/hooks/useLookupCache.hook';
import { SchemaService, SchemaWithDuplicatesService } from '@common/services/schema';
import { RecordNormalizingService } from '@common/services/recordNormalizing';
import { RecordToSchemaMappingService } from '@common/services/recordToSchemaMapping';
import { useCommonStatus } from '@common/hooks/useCommonStatus';
import { EntryPropertiesGeneratorService } from '@common/services/schema/entryPropertiesGenerator.service';

type ServicesProviderProps = {
  children: ReactElement;
};

export const ServicesProvider: FC<ServicesProviderProps> = ({ children }) => {
  const lookupCacheService = useLookupCacheService();
  const commonStatusService = useCommonStatus();

  const entryPropertiesGeneratorService = new EntryPropertiesGeneratorService();
  const selectedEntriesService = new SelectedEntriesService([]);
  const userValuesService = new UserValuesService({}, apiClient, lookupCacheService);
  const schemaWithDuplicatesService = new SchemaWithDuplicatesService(
    {} as Schema,
    selectedEntriesService,
    entryPropertiesGeneratorService,
  );
  const recordNormalizingService = new RecordNormalizingService();
  const recordToSchemaMappingService = new RecordToSchemaMappingService(
    selectedEntriesService,
    schemaWithDuplicatesService,
    userValuesService,
    commonStatusService,
  );
  const schemaCreatorService = new SchemaService(selectedEntriesService, entryPropertiesGeneratorService);

  return (
    <ServicesContext.Provider
      value={{
        selectedEntriesService,
        userValuesService,
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
