type RecordModelFieldType = 'string' | 'number' | 'boolean' | 'object' | 'array';

interface RecordModelField {
  type: RecordModelFieldType;
  value?: RecordModelField | string;
  fields?: Record<string, RecordModelField>;
  options?: {
    hiddenWrapper?: boolean;
    isReference?: boolean;
    isRootEntity?: boolean;
    references?: RecordModelReferenceDefinition[];
    flattenDropdown?: boolean;
    sourceField?: string;
  };
}

interface RecordModelReferenceDefinition {
  outputField: string;
}

interface RecordModel {
  [key: string]: RecordModelField;
}
