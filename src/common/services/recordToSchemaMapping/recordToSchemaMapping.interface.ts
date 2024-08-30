export interface IRecordToSchemaMapping {
  init(): void;

  setSchema(schema: Schema): void;

  setRecord(record: RecordEntry, recordBlocks: RecordBlocksList): void;

  setTemplateMetadata(templateMetadata?: ResourceTemplateMetadata[]): void;

  getUpdatedSchema: () => Schema;
}
