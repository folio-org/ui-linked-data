type RecordSchemaEntryType = 'string' | 'number' | 'boolean' | 'object' | 'array';

interface RecordSchemaEntry {
  type: RecordSchemaEntryType;
  value?: RecordSchemaEntry | string;
  fields?: Record<string, RecordSchemaEntry>;
  options?: {
    hiddenWrapper?: boolean;
    isReference?: boolean;
    isRootEntry?: boolean;
    references?: RecordSchemaReferenceDefinition[];
    flattenDropdown?: boolean;
    sourceField?: string;
    valueContainer?: ValueContainerOption;
    mappedValues?: Record<string, { uri?: string }>;
  };
}

interface ValueContainerOption {
  field: string;
  type?: 'array' | 'object';
}

interface RecordSchemaReferenceDefinition {
  outputField: string;
}

interface RecordSchema {
  [key: string]: RecordSchemaEntry;
}
