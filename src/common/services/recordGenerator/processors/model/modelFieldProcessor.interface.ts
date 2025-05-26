import { ValueResult } from '../../types/valueTypes';

export interface ModelFieldProcessor {
  canProcess(field: RecordModelField): boolean;

  process(field: RecordModelField, entry: SchemaEntry, userValues: UserValues): ValueResult;
}
