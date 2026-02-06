type RecordSchemaEntryType = 'string' | 'number' | 'boolean' | 'object' | 'array';

type ValueSourceType = 'id' | 'label' | 'meta.uri' | 'meta.srsId' | 'meta.basicLabel';

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
    // Used for linking to a specific property in the valueContainer
    linkedProperty?: string;
    includeTerm?: boolean;
    propertyKey?: string;
    // Explicit value mapping for this property - specifies which UserValueContents field maps to this property
    valueSource?: ValueSourceType;
    // Conditional properties configuration - defines which properties are active for each source type
    conditionalProperties?: Record<string, string[]>;
    // Default source type when not specified in value
    defaultSourceType?: string;
    // Properties that should always be included if they have a value, regardless of conditionalProperties
    alwaysIncludeIfPresent?: string[];
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
