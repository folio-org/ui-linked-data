import { ValueOptions } from '../../types/valueTypes';
import { IValueProcessor } from './valueProcessor.interface';

export class ValueProcessor implements IValueProcessor {
  processSimpleValues(values: UserValueContents[]) {
    return values?.map(({ label, meta }) => meta?.basicLabel || label).filter(label => label !== undefined);
  }

  process(values: UserValueContents[], options: ValueOptions = {}) {
    const processedValue = this.processSimpleValues(values);

    return {
      value: processedValue,
      options,
    };
  }

  processSchemaValues(processorValue: Record<string, any>, options: ValueOptions = {}) {
    if (Object.keys(processorValue).length === 0) {
      return { value: null, options };
    }

    return {
      value: processorValue,
      options,
    };
  }
}
