export interface ValueOptions {
  hiddenWrapper?: boolean;
  isReference?: boolean;
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

export interface UserValueContent {
  id?: string;
  label: string;
  meta?: {
    uri?: string;
    basicLabel?: string;
  };
}

export interface ChildEntryWithValues {
  childEntry: SchemaEntry;
  childValues: UserValueContent[];
}

export type GroupedValue = Array<{
  childEntry: SchemaEntry;
  valueAtIndex: UserValueContent | null;
}>;
