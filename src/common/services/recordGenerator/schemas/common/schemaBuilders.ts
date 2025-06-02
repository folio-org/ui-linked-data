import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';

export function createObjectField(fields: Record<string, RecordSchemaEntry>, options = {}) {
  return {
    type: RecordSchemaEntryType.object,
    fields,
    ...(Object.keys(options).length > 0 ? { options } : {}),
  };
}

export function createArrayObjectField(fields: Record<string, RecordSchemaEntry>, options = {}) {
  return {
    type: RecordSchemaEntryType.array,
    value: RecordSchemaEntryType.object,
    fields,
    ...(Object.keys(options).length > 0 ? { options } : {}),
  };
}

export function createStatusField(statusFields: Record<string, RecordSchemaEntry>) {
  return {
    type: RecordSchemaEntryType.array,
    value: RecordSchemaEntryType.object,
    fields: statusFields,
  };
}

export function createNotesField(mappingReference: Record<string, { uri?: string }>) {
  return {
    type: RecordSchemaEntryType.array,
    value: RecordSchemaEntryType.object,
    fields: {
      type: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
        options: {
          mappedValues: mappingReference,
        },
      },
      value: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
      },
    },
  };
}

export function createStringArrayField(options = {}) {
  return {
    type: RecordSchemaEntryType.array,
    value: RecordSchemaEntryType.string,
    ...(Object.keys(options).length > 0 ? { options } : {}),
  };
}
