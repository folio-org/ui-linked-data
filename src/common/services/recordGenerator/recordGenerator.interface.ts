export interface IRecordGenerator {
  generate(data: { schema: Schema; model: RecordModel; userValues: UserValues }): Record<string, any>;
}
