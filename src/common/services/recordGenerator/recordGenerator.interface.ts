export interface IRecordGeneratorData {
  schema: Schema;
  userValues: UserValues;
  selectedEntries: string[];
  referenceIds?: { id: string }[];
  profileId?: string | null;
}

export interface IRecordGenerator {
  generate(data: IRecordGeneratorData, entityType?: ResourceType): Record<string, any>;
}
