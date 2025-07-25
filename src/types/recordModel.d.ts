type RecordSchemaEntryType = 'string' | 'number' | 'boolean' | 'object' | 'array';

interface RecordSchemaEntry {
  type: RecordSchemaEntryType;
  value?: RecordSchemaEntry | string;
  properties?: Record<string, RecordSchemaEntry>;
  options?: {
    hiddenWrapper?: boolean;
    isReference?: boolean;
    isRootEntry?: boolean;
    references?: RecordSchemaReferenceDefinition[];
    flattenDropdown?: boolean;
    sourceProperty?: string;
    valueContainer?: ValueContainerOption;
    mappedValues?: Record<string, { uri?: string }>;
    defaultValue?: string;
    linkedProperty?: string; // Used for linking to a specific property in the valueContainer
    includeTerm?: boolean;
  };
}

interface ValueContainerOption {
  property: string;
  type?: 'array' | 'object';
}

interface RecordSchemaReferenceDefinition {
  outputProperty: string;
}

interface RecordSchema {
  [key: string]: RecordSchemaEntry;
}
