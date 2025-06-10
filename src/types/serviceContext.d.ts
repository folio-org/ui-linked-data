type ISelectedEntriesService = import('@common/services/selectedEntries/selectedEntries.interface').ISelectedEntries;
type IUserValuesService = import('@common/services/userValues/userValues.interface').IUserValues;
type ISchemaWithDuplicatesService =
  import('@common/services/schema/schemaWithDuplicates.interface').ISchemaWithDuplicates;
type IRecordNormalizingService =
  import('@common/services/recordNormalizing/recordNormalizing.interface').IRecordNormalizing;
type IRecordToSchemaMappingService =
  import('@common/services/recordToSchemaMapping/recordToSchemaMapping.interface').IRecordToSchemaMapping;
type ISchemaService = import('@common/services/schema/schema.interface').ISchema;
type ISchemaGeneratorService = import('@common/services/schema/schemaGenerator.interface').ISchemaGenerator;
type IRecordGeneratorService = import('@common/services/recordGenerator/recordGenerator.interface').IRecordGenerator;

type ServicesParams = {
  selectedEntriesService?: ISelectedEntriesService;
  userValuesService?: IUserValuesService;
  schemaWithDuplicatesService?: ISchemaWithDuplicatesService;
  lookupCacheService?: ILookupCacheService;
  recordNormalizingService?: IRecordNormalizingService;
  recordToSchemaMappingService?: IRecordToSchemaMappingService;
  schemaGeneratorService?: ISchemaGeneratorService;
  recordGeneratorService?: IRecordGeneratorService;
};
