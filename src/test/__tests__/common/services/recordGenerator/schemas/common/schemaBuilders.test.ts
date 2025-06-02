import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import {
  createObjectField,
  createArrayObjectField,
  createStatusField,
  createNotesField,
  createStringArrayField,
} from '@common/services/recordGenerator/schemas/common/schemaBuilders';

describe('SchemaBuilders', () => {
  describe('createObjectField', () => {
    it('creates an object field with empty options', () => {
      const fields = {
        field_1: { type: RecordSchemaEntryType.string },
      };

      const result = createObjectField(fields);

      expect(result).toEqual({
        type: RecordSchemaEntryType.object,
        fields,
      });
    });

    it('creates an object field with provided options', () => {
      const fields = {
        field_1: { type: RecordSchemaEntryType.string },
      };
      const options = { someOption: 'value' };

      const result = createObjectField(fields, options);

      expect(result).toEqual({
        type: RecordSchemaEntryType.object,
        fields,
        options,
      });
    });
  });

  describe('createArrayObjectField', () => {
    it('creates an array object field with empty options', () => {
      const fields = {
        field_1: { type: RecordSchemaEntryType.string },
      };

      const result = createArrayObjectField(fields);

      expect(result).toEqual({
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields,
      });
    });

    it('creates an array object field with provided options', () => {
      const fields = {
        field_1: { type: RecordSchemaEntryType.string },
      };
      const options = { someOption: 'value' };

      const result = createArrayObjectField(fields, options);

      expect(result).toEqual({
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields,
        options,
      });
    });
  });

  describe('createStatusField', () => {
    it('creates a status field with provided status fields', () => {
      const statusFields = {
        status: { type: RecordSchemaEntryType.string },
        date: { type: RecordSchemaEntryType.string },
      };

      const result = createStatusField(statusFields);

      expect(result).toEqual({
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields: statusFields,
      });
    });
  });

  describe('createNotesField', () => {
    it('creates a notes field with mapping reference', () => {
      const mappingReference = {
        note1: { uri: 'uri_1' },
        note2: { uri: 'uri_2' },
      };

      const result = createNotesField(mappingReference);

      expect(result).toEqual({
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
      });
    });
  });

  describe('createStringArrayField', () => {
    it('creates a string array field with empty options', () => {
      const result = createStringArrayField();

      expect(result).toEqual({
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
      });
    });

    it('creates a string array field with provided options', () => {
      const options = { someOption: 'value' };

      const result = createStringArrayField(options);

      expect(result).toEqual({
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
        options,
      });
    });
  });
});
