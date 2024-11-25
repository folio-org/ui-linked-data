export interface IRecord {
  init: (params: {
    schema: Map<string, SchemaEntry>;
    initKey: string | null;
    userValues: UserValues;
    selectedEntries: string[];
  }) => IRecord;

  generate: () => Record<string, RecordEntry<RecursiveRecordSchema>> | undefined;
}
