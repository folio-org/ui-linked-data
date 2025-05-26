import { ValueOptions } from '../../types/valueTypes';

export class ValueProcessor {
  processSimpleValues(values: UserValueContents[]) {
    return values?.map(({ label }) => label).filter(label => label !== undefined);
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
