export type IRecordToSchemaMappingInit = {
  schema: Schema;
  record: RecordEntry;
  recordBlocks: RecordBlocksList;
  templateMetadata?: ResourceTemplateMetadata[];
};
export interface IRecordToSchemaMapping {
  init: ({ schema, record, recordBlocks, templateMetadata }: IRecordToSchemaMappingInit) => Promise<void>;

  get: () => Schema;
}
