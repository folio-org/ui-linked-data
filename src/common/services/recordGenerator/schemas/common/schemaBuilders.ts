import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';

export function createObjectProperty(properties: Record<string, RecordSchemaEntry>, options = {}) {
  return {
    type: RecordSchemaEntryType.object,
    properties,
    ...(Object.keys(options).length > 0 ? { options } : {}),
  };
}

export function createArrayObjectProperty(properties: Record<string, RecordSchemaEntry>, options = {}) {
  return {
    type: RecordSchemaEntryType.array,
    value: RecordSchemaEntryType.object,
    properties,
    ...(Object.keys(options).length > 0 ? { options } : {}),
  };
}

export function createStatusProperty(statusProperties: Record<string, RecordSchemaEntry>) {
  return {
    type: RecordSchemaEntryType.array,
    value: RecordSchemaEntryType.object,
    properties: statusProperties,
  };
}

export function createNotesProperty(mappingReference: Record<string, { uri?: string }>) {
  return {
    type: RecordSchemaEntryType.array,
    value: RecordSchemaEntryType.object,
    properties: {
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

export function createStringArrayProperty(options = {}) {
  return {
    type: RecordSchemaEntryType.array,
    value: RecordSchemaEntryType.string,
    ...(Object.keys(options).length > 0 ? { options } : {}),
  };
}
