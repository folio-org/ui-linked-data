import { ProcessContext } from '../../types/common.types';

export interface IProfileSchemaProcessorManager {
  process(data: ProcessContext): Record<string, any> | never[];
}
