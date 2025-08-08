import { RecordSchemaFactory } from '@common/services/recordGenerator/schemas/recordSchemaFactory';

jest.mock('@common/services/recordGenerator/schemas/profiles', () => ({
  profileRecordSchemas: {
    instance: { test: 'schema' },
  },
}));

describe('RecordSchemaFactory', () => {
  describe('getRecordSchema', () => {
    it('returns correct schema for valid profile and entity types', () => {
      const result = RecordSchemaFactory.getRecordSchema('instance' as ResourceType);

      expect(result).toEqual({ test: 'schema' });
    });

    it('throws error for unknown entity type', () => {
      expect(() => {
        RecordSchemaFactory.getRecordSchema('unknownEntity' as ResourceType);
      }).toThrow('Unknown entity type unknownEntity');
    });
  });
});
