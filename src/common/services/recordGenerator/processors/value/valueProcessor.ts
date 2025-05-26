import { UserValueContent, ValueOptions, ValueResult } from '../../types/valueTypes';

export class ValueProcessor {
  processSimpleValues(values: UserValueContent[]): string[] {
    return values?.map(({ label }) => label).filter((label): label is string => label !== undefined);
  }

  process(values: UserValueContent[], options: ValueOptions = {}): ValueResult {
    const processedValue = this.processSimpleValues(values);

    return {
      value: processedValue,
      options,
    };
  }

  processSchemaValues(processorValue: Record<string, any>, options: ValueOptions = {}): ValueResult {
    if (Object.keys(processorValue).length === 0) {
      return { value: null, options };
    }

    return {
      value: processorValue,
      options,
    };
  }
}
