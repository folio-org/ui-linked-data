import { RecordSchemaFactory } from '@common/services/recordGenerator/schemas/recordSchemaFactory';

jest.mock('@common/services/recordGenerator/schemas/profiles', () => ({
  profileRecordSchemas: {
    monograph: {
      instance: { test: 'schema' },
    },
  },
}));

describe('RecordSchemaFactory', () => {
  describe('getRecordSchema', () => {
    it('returns correct schema for valid profile and entity types', () => {
      const result = RecordSchemaFactory.getRecordSchema('monograph' as ProfileType, 'instance' as ResourceType);

      expect(result).toEqual({ test: 'schema' });
    });

    it('throws error for unknown profile type', () => {
      expect(() => {
        RecordSchemaFactory.getRecordSchema('unknownProfile' as ProfileType, 'instance' as ResourceType);
      }).toThrow('Unknown profile type: unknownProfile');
    });

    it('throws error for unknown entity type', () => {
      expect(() => {
        RecordSchemaFactory.getRecordSchema('monograph' as ProfileType, 'unknownEntity' as ResourceType);
      }).toThrow('Unknown entity type unknownEntity for profile monograph');
    });
  });
});
