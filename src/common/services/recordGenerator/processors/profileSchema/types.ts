export interface SchemaEntry {
  uuid: string;
  type: string | undefined;
  uriBFLite?: string;
  children?: string[];
}

export interface RecordSchemaEntry {
  type?: string;
  options?: {
    hiddenWrapper?: boolean;
    flattenDropdown?: boolean;
    sourceField?: string;
  };
}

export interface UserValueMeta {
  uri?: string;
  basicLabel?: string;
}

export interface UserValueContents {
  label: string;
  meta?: UserValueMeta;
}

export interface UserValue {
  uuid: string;
  contents: UserValueContents[];
}

export interface UserValues {
  [key: string]: UserValue;
}

export interface SimpleFieldResult {
  'http://bibfra.me/vocab/lite/link': string[];
  'http://bibfra.me/vocab/lite/label': string[];
}

export interface ExtendedFieldResult extends SimpleFieldResult {
  'http://bibfra.me/vocab/lite/name': string[];
  'http://bibfra.me/vocab/marc/code': string[];
}

export interface ProcessorResult {
  [key: string]: string[] | SimpleFieldResult[] | ExtendedFieldResult[] | ProcessorResult | ProcessorResult[];
}
