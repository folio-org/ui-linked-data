export interface IRecordGeneratorData {
  schema: Schema;
  userValues: UserValues;
  referenceIds?: { id: string }[];
}

export interface IRecordGenerator {
  generate(data: IRecordGeneratorData, profileType?: ProfileType, entityType?: ResourceType): Record<string, any>;
}
