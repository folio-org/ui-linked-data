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

export const createSchemaPipeline = (
  { commonStatusService }: SharedInfraServices,
  loadLookup: (uri: string) => Promise<MultiselectOption[]>,
): SchemaPipelineServices => {
  const entryPropertiesGeneratorService = new EntryPropertiesGeneratorService();
  const marcMappingGeneratorService = new MarcMappingGeneratorService();
  const selectedEntriesService = new SelectedEntriesService([]);
  const userValuesService = new UserValuesService({}, loadLookup);
  const schemaWithDuplicatesService = new SchemaWithDuplicatesService(
    {} as Schema,
    selectedEntriesService,
    entryPropertiesGeneratorService,
    userValuesService,
  );
  const recordNormalizingService = new RecordNormalizingService();
  const recordToSchemaMappingService = new RecordToSchemaMappingService(
    selectedEntriesService,
    schemaWithDuplicatesService,
    userValuesService,
    commonStatusService,
  );
  const schemaGeneratorService = new SchemaGeneratorService(
    selectedEntriesService,
    entryPropertiesGeneratorService,
    marcMappingGeneratorService,
  );
  const recordGeneratorService = new RecordGenerator();

  return {
    selectedEntriesService,
    userValuesService,
    schemaWithDuplicatesService,
    recordNormalizingService,
    recordToSchemaMappingService,
    schemaGeneratorService,
    recordGeneratorService,
  };
};
