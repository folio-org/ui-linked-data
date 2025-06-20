import { FC, useMemo, type ReactElement } from 'react';
import { ServicesContext } from '@src/contexts';
import { SelectedEntriesService } from '@common/services/selectedEntries';
import { UserValuesService } from '@common/services/userValues';
import { apiClient } from '@common/api/client';
import { useLookupCacheService } from '@common/hooks/useLookupCache.hook';
import { SchemaGeneratorService, SchemaWithDuplicatesService } from '@common/services/schema';
import { RecordNormalizingService } from '@common/services/recordNormalizing';
import { RecordToSchemaMappingService } from '@common/services/recordToSchemaMapping';
import { useCommonStatus } from '@common/hooks/useCommonStatus';
import { EntryPropertiesGeneratorService } from '@common/services/schema/entryPropertiesGenerator.service';
import { RecordGenerator } from '@common/services/recordGenerator';

type ServicesProviderProps = {
  children: ReactElement<any>;
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
  const schemaGeneratorService = useMemo(
    () => new SchemaGeneratorService(selectedEntriesService, entryPropertiesGeneratorService),
    [selectedEntriesService, entryPropertiesGeneratorService],
  );
  const recordGeneratorService = useMemo(() => new RecordGenerator(), []);

  const servicesValue = useMemo(
    () => ({
      selectedEntriesService,
      userValuesService,
      schemaWithDuplicatesService,
      lookupCacheService,
      recordNormalizingService,
      recordToSchemaMappingService,
      schemaGeneratorService,
      recordGeneratorService,
    }),
    [
      selectedEntriesService,
      userValuesService,
      schemaWithDuplicatesService,
      lookupCacheService,
      recordNormalizingService,
      recordToSchemaMappingService,
      schemaGeneratorService,
      recordGeneratorService,
    ],
  );

  return <ServicesContext.Provider value={servicesValue}>{children}</ServicesContext.Provider>;
};
