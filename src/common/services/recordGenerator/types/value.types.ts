export interface ValueOptions {
  hiddenWrapper?: boolean;
  isReference?: boolean;
  references?: Array<{
    targetEntityType: string;
    outputField: string;
  }>;
}

export type SchemaFieldValue = string | SchemaFieldValueArray | SchemaFieldValueObject;

export type SchemaFieldValueArray = Array<SchemaFieldValue>;

export interface SchemaFieldValueObject {
  [key: string]: SchemaFieldValue | SchemaFieldValueArray | null;
}

export interface ValueResult {
  value: SchemaFieldValue | null;
  options: ValueOptions;
}

export type GeneratedValue = SchemaFieldValueObject;

export interface ChildEntryWithValues {
  childEntry: SchemaEntry;
  childValues: UserValueContents[];
}

export type GroupedValue = Array<{
  childEntry: SchemaEntry;
  valueAtIndex: UserValueContents | null;
}>;
