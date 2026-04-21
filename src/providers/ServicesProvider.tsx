import { FC, type ReactElement, useMemo } from 'react';

import { apiClient } from '@/common/api/client';
import { useCommonStatus } from '@/common/hooks/useCommonStatus';
import { useLookupCacheService } from '@/common/hooks/useLookupCache.hook';
import { RecordGenerator } from '@/common/services/recordGenerator';
import { RecordNormalizingService } from '@/common/services/recordNormalizing';
import { RecordToSchemaMappingService } from '@/common/services/recordToSchemaMapping';
import {
  MarcMappingGeneratorService,
  SchemaGeneratorService,
  SchemaWithDuplicatesService,
} from '@/common/services/schema';
import { EntryPropertiesGeneratorService } from '@/common/services/schema/entryPropertiesGenerator.service';
import { SelectedEntriesService } from '@/common/services/selectedEntries';
import { UserValuesService } from '@/common/services/userValues';
import { ServicesContext } from '@/contexts';

type ServicesProviderProps = {
  children: ReactElement<unknown>;
};

export const ServicesProvider: FC<ServicesProviderProps> = ({ children }) => {
  const lookupCacheService = useLookupCacheService();
  const commonStatusService = useCommonStatus();

  const entryPropertiesGeneratorService = useMemo(() => new EntryPropertiesGeneratorService(), []);
  const marcMappingGeneratorService = useMemo(() => new MarcMappingGeneratorService(), []);
  const selectedEntriesService = useMemo(() => new SelectedEntriesService([]), []);
  const userValuesService = useMemo(
    () => new UserValuesService({}, apiClient, lookupCacheService),
    [lookupCacheService],
  );
  const schemaWithDuplicatesService = useMemo(
    () =>
      new SchemaWithDuplicatesService(
        {} as Schema,
        selectedEntriesService,
        entryPropertiesGeneratorService,
        userValuesService,
      ),
    [selectedEntriesService, entryPropertiesGeneratorService, userValuesService],
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
    () =>
      new SchemaGeneratorService(selectedEntriesService, entryPropertiesGeneratorService, marcMappingGeneratorService),
    [selectedEntriesService, entryPropertiesGeneratorService, marcMappingGeneratorService],
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
