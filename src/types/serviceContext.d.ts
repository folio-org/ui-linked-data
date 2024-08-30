type ISelectedEntries = import('@common/services/selectedEntries/selectedEntries.interface').ISelectedEntries;
type IUserValues = import('@common/services/userValues/userValues.interface').IUserValues;
type ISchemaWithDuplicates = import('@common/services/schema/schemaWithDuplicates.interface').ISchemaWithDuplicates;
type IRecordNormalizingService =
  import('@common/services/recordNormalizing/recordNormalizing.interface').IRecordNormalizing;
type IRecordToSchemaMapping =
  import('@common/services/recordToSchemaMapping/recordToSchemaMapping.interface').IRecordToSchemaMapping;

type ServicesParams = {
  selectedEntriesService?: ISelectedEntries;
  userValuesService?: IUserValues;
  schemaWithDuplicatesService?: ISchemaWithDuplicates;
  lookupCacheService?: ILookupCacheService;
  recordNormalizingService?: IRecordNormalizingService;
  recordToSchemaMappingService?: IRecordToSchemaMapping;
};
