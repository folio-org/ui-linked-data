/** Options that can be passed with a schema value result */
export interface ValueOptions {
  hiddenWrapper?: boolean;
}

/** The base type for any value in a generated record */
export type SchemaFieldValue = string | SchemaFieldValueArray | SchemaFieldValueObject;

/** An array of values in a generated record */
export type SchemaFieldValueArray = Array<SchemaFieldValue>;

/** An object containing values in a generated record */
export interface SchemaFieldValueObject {
  [key: string]: SchemaFieldValue | SchemaFieldValueArray | null;
}

/** A result value from processing a schema, together with options */
export interface ValueResult {
  value: SchemaFieldValue | null;
  options: ValueOptions;
}

/** A record of field names to generated values */
export type GeneratedValue = SchemaFieldValueObject;
