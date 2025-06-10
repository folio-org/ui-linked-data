export interface ValueOptions {
  hiddenWrapper?: boolean;
  isReference?: boolean;
  references?: Array<{
    targetEntityType: string;
    outputProperty: string;
  }>;
}

export type SchemaPropertyValue = string | SchemaPropertyValueArray | SchemaPropertyValueObject;

export type SchemaPropertyValueArray = Array<SchemaPropertyValue>;

export interface SchemaPropertyValueObject {
  [key: string]: SchemaPropertyValue | SchemaPropertyValueArray | null;
}

export interface ValueResult {
  value: SchemaPropertyValue | null;
  options: ValueOptions;
}

export type GeneratedValue = SchemaPropertyValueObject;

export interface ChildEntryWithValues {
  childEntry: SchemaEntry;
  childValues: UserValueContents[];
}

export type GroupedValue = Array<{
  childEntry: SchemaEntry;
  valueAtIndex: UserValueContents | null;
}>;
