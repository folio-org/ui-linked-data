export interface IRecordGenerator {
  generate(
    data: { schema: Schema; userValues: UserValues; record?: RecordEntry; selectedEntries?: string[] },
    profileType?: ProfileType,
    entityType?: ProfileEntityType,
  ): Record<string, any>;
}
