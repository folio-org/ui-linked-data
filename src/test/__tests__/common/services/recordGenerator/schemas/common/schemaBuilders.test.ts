import { BFLITE_URIS } from '@common/constants/bibframeMapping.constants';
import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import {
  createObjectProperty,
  createArrayObjectProperty,
  createStatusProperty,
  createNotesProperty,
  createStringArrayProperty,
} from '@common/services/recordGenerator/schemas/common/schemaBuilders';

describe('SchemaBuilders', () => {
  describe('createObjectProperty', () => {
    it('creates an object property with empty options', () => {
      const properties = {
        property_1: { type: RecordSchemaEntryType.string },
      };

      const result = createObjectProperty(properties);

      expect(result).toEqual({
        type: RecordSchemaEntryType.object,
        properties,
      });
    });

    it('creates an object property with provided options', () => {
      const properties = {
        property_1: { type: RecordSchemaEntryType.string },
      };
      const options = { someOption: 'value' };

      const result = createObjectProperty(properties, options);

      expect(result).toEqual({
        type: RecordSchemaEntryType.object,
        properties,
        options,
      });
    });
  });

  describe('createArrayObjectProperty', () => {
    it('creates an array object property with empty options', () => {
      const properties = {
        property_1: { type: RecordSchemaEntryType.string },
      };

      const result = createArrayObjectProperty(properties);

      expect(result).toEqual({
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties,
      });
    });

    it('creates an array object property with provided options', () => {
      const properties = {
        property_1: { type: RecordSchemaEntryType.string },
      };
      const options = { someOption: 'value' };

      const result = createArrayObjectProperty(properties, options);

      expect(result).toEqual({
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties,
        options,
      });
    });
  });

  describe('createStatusProperty', () => {
    it('creates a status property with provided status properties', () => {
      const statusProperties = {
        status: { type: RecordSchemaEntryType.string },
        date: { type: RecordSchemaEntryType.string },
      };

      const result = createStatusProperty(statusProperties);

      expect(result).toEqual({
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: statusProperties,
      });
    });
  });

  describe('createNotesProperty', () => {
    it('creates a notes property with mapping reference', () => {
      const mappingReference = {
        note1: { uri: 'uri_1' },
        note2: { uri: 'uri_2' },
      };

      const result = createNotesProperty(mappingReference);

      expect(result).toEqual({
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
      });
    });
  });

  describe('createStringArrayProperty', () => {
    it('creates a string array property with empty options', () => {
      const result = createStringArrayProperty();

      expect(result).toEqual({
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
      });
    });

    it('creates a string array property with provided options', () => {
      const options = { someOption: 'value' };

      const result = createStringArrayProperty(options);

      expect(result).toEqual({
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
        options,
      });
    });
  });
});
