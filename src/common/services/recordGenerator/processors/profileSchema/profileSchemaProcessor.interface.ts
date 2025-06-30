import { ProcessContext } from '../../types/common.types';

export interface IProfileSchemaProcessor {
  canProcess(profileSchemaEntry: SchemaEntry, recordSchemaEntry: RecordSchemaEntry): boolean;

  process(data: ProcessContext): Record<string, any>;
}
