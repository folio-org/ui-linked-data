export type IInit = {
  schema: Schema;
  record: RecordEntry;
  recordBlocks: RecordBlocksList;
  templateMetadata?: ResourceTemplateMetadata[];
};
export interface IRecordToSchemaMapping {
  init({ schema, record, recordBlocks, templateMetadata }: IInit): Promise<void>;

  getUpdatedSchema: () => Schema;
}
