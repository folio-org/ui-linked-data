type ISelectedEntries = import('@common/services/selectedEntries/selectedEntries.interface').ISelectedEntries;
type IUserValues = import('@common/services/userValues/userValues.interface').IUserValues;
type ISchemaWithDuplicates =
  import('@common/services/schema/schemaWithDuplicates.interface').ISchemaWithDuplicates;

type ServicesParams = {
  selectedEntriesService?: ISelectedEntries;
  userValuesService?: IUserValues;
  schemaWithDuplicatesService?: ISchemaWithDuplicates;
};
