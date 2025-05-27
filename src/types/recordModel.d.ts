type RecordModelFieldType = 'string' | 'number' | 'boolean' | 'object' | 'array';

interface RecordModelField {
  type: RecordModelFieldType;
  value?: RecordModelField | string;
  fields?: Record<string, RecordModelField>;
  options?: {
    hiddenWrapper?: boolean;
    isReference?: boolean;
  };
}

interface RecordModel {
  [key: string]: RecordModelField;
}
