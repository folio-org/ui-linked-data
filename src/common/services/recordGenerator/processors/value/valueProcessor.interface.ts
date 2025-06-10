import { ValueOptions } from '../../types/value.types';

export interface UserValueContents {
  id?: string;
  label?: string;
  meta?: {
    basicLabel?: string;
    srsId?: string;
    [key: string]: any;
  };
}

export interface SchemaValue {
  [key: string]: string | number | boolean | null | SchemaValue;
}

export interface IValueProcessor {
  processSimpleValues(values: UserValueContents[]): string[];
  process(
    values: UserValueContents[],
    options?: ValueOptions,
  ): {
    value: string[] | null;
    options: ValueOptions;
  };
  processSchemaValues(
    processorValue: Record<string, SchemaValue>,
    options?: ValueOptions,
  ): {
    value: Record<string, SchemaValue> | null;
    options: ValueOptions;
  };
}
