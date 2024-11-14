import { FC, useMemo } from 'react';
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

  const entryPropertiesGeneratorService = useMemo(() => new EntryPropertiesGeneratorService(), []);
  const selectedEntriesService = useMemo(() => new SelectedEntriesService([]), []);
  const userValuesService = useMemo(
    () => new UserValuesService({}, apiClient, lookupCacheService),
    [lookupCacheService],
  );
  const schemaWithDuplicatesService = useMemo(
    () => new SchemaWithDuplicatesService({} as Schema, selectedEntriesService, entryPropertiesGeneratorService),
    [selectedEntriesService, entryPropertiesGeneratorService],
  );
  const recordNormalizingService = useMemo(() => new RecordNormalizingService(), []);
  const recordToSchemaMappingService = useMemo(
    () =>
      new RecordToSchemaMappingService(
        selectedEntriesService,
        schemaWithDuplicatesService,
        userValuesService,
        commonStatusService,
      ),
    [selectedEntriesService, schemaWithDuplicatesService, userValuesService, commonStatusService],
  );
  const schemaCreatorService = useMemo(
    () => new SchemaService(selectedEntriesService, entryPropertiesGeneratorService),
    [selectedEntriesService, entryPropertiesGeneratorService],
  );

  const servicesValue = useMemo(
    () => ({
      selectedEntriesService,
      userValuesService,
      schemaWithDuplicatesService,
      lookupCacheService,
      recordNormalizingService,
      recordToSchemaMappingService,
      schemaCreatorService,
    }),
    [
      selectedEntriesService,
      userValuesService,
      schemaWithDuplicatesService,
      lookupCacheService,
      recordNormalizingService,
      recordToSchemaMappingService,
      schemaCreatorService,
    ],
  );

  return <ServicesContext.Provider value={servicesValue}>{children}</ServicesContext.Provider>;
};
