import { ValueResult } from '../../types/valueTypes';

export type ModelFieldProcessingContext = {
  field: RecordModelField;
  entry: SchemaEntry;
  userValues: UserValues;
};

export interface ModelFieldProcessor {
  canProcess(field: RecordModelField): boolean;

  process(modelFieldProcessingContext: ModelFieldProcessingContext): ValueResult;
}
