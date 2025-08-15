import { BFLITE_URIS } from '@common/constants/bibframeMapping.constants';
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
          defaultValue: BFLITE_URIS.NOTE,
          linkedProperty: 'value',
        },
      },
      value: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
      },
    },
  };
}

export function createLanguagesProperty() {
  return {
    type: RecordSchemaEntryType.array,
    value: RecordSchemaEntryType.object,
    properties: {
      _types: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
        options: {
          defaultValue: BFLITE_URIS.LANGUAGE,
          linkedProperty: '_codes',
        },
      },
      _codes: createLinkTermObjectArrayProperty(),
    },
  };
}

export function createLinkTermObjectArrayProperty() {
  return {
    type: RecordSchemaEntryType.array,
    value: RecordSchemaEntryType.object,
    properties: {
      [BFLITE_URIS.LINK]: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
      },
      [BFLITE_URIS.TERM]: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
      },
    },
    options: {
      includeTerm: true,
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
