export interface IRecordGenerator {
  generate(data: { schema: Schema; model: RecordModel; userValues: UserValues, record?: RecordEntry }): Record<string, any>;
}
