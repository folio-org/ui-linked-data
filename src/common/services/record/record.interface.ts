export interface IRecordGenerator {
  init: (params: {
    schema: Map<string, SchemaEntry>;
    initKey: string | null;
    userValues: UserValues;
    selectedEntries: string[];
  }) => void;
  generate: () => Record<string, RecordEntry<RecursiveRecordSchema>> | undefined;
}
