import { ProfileSchemaManager } from '@/common/services/recordGenerator/profileSchemaManager';

describe('ProfileSchemaManager', () => {
  let manager: ProfileSchemaManager;
  let mockSchema: Schema;
  let mockEntry_1: SchemaEntry;
  let mockEntry_2: SchemaEntry;

  beforeEach(() => {
    mockEntry_1 = {
      uuid: 'uuid_1',
      uriBFLite: 'uri_1',
      path: ['parent_1', 'child_1'],
    } as SchemaEntry;

    mockEntry_2 = {
      uuid: 'uuid_2',
      uriBFLite: 'uri_2',
      path: ['parent_1', 'child2'],
      children: ['uuid_3'],
    } as SchemaEntry;

    mockSchema = new Map([
      ['uuid_1', mockEntry_1],
      ['uuid_2', mockEntry_2],
      ['uuid_3', { uuid: 'uuid_3' } as SchemaEntry],
    ]);

    manager = new ProfileSchemaManager();
  });

  describe('init', () => {
    it('initializes with empty schema by default', () => {
      expect(manager.getSchema().size).toBe(0);
    });

    it('sets schema and resets caches on initialization', () => {
      manager.init(mockSchema);

      expect(manager.getSchema()).toBe(mockSchema);
    });
  });

  describe('getSchema', () => {
    it('returns current schema state', () => {
      manager.init(mockSchema);

      const schema = manager.getSchema();

      expect(schema.size).toBe(3);
      expect(schema.get('uuid_1')).toBe(mockEntry_1);
      expect(schema.get('uuid_2')).toBe(mockEntry_2);
    });
  });

  describe('findSchemaEntriesByUriBFLite', () => {
    beforeEach(() => {
      manager.init(mockSchema);
    });

    it('returns empty array for non-existent uriBFLite', () => {
      const result = manager.findSchemaEntriesByUriBFLite('non-existent');

      expect(result).toEqual([]);
    });

    it('returns matching entries for existing uriBFLite', () => {
      const result = manager.findSchemaEntriesByUriBFLite('uri_1');

      expect(result).toEqual([mockEntry_1]);
    });

    it('filters entries by parent path when provided', () => {
      const result = manager.findSchemaEntriesByUriBFLite('uri_1', ['parent_1']);

      expect(result).toEqual([mockEntry_1]);
    });

    it('returns empty array when parent path does not match', () => {
      const result = manager.findSchemaEntriesByUriBFLite('uri_1', ['wrong-parent']);

      expect(result).toEqual([]);
    });

    it('returns empty array when parent path is longer than entry path', () => {
      const result = manager.findSchemaEntriesByUriBFLite('uri_1', ['parent_1', 'child_1', 'subchild']);

      expect(result).toEqual([]);
    });
  });

  describe('getSchemaEntry', () => {
    beforeEach(() => {
      manager.init(mockSchema);
    });

    it('returns undefined for non-existent uuid', () => {
      const result = manager.getSchemaEntry('non-existent');

      expect(result).toBeUndefined();
    });

    it('returns correct entry for existing uuid', () => {
      const result = manager.getSchemaEntry('uuid_1');

      expect(result).toBe(mockEntry_1);
    });
  });

  describe('hasOptionValues', () => {
    const mockUserValues = {
      uuid_3: {
        contents: ['some content'],
      },
    } as unknown as UserValues;

    beforeEach(() => {
      manager.init(mockSchema);
    });

    it('returns false when entry has no children', () => {
      const result = manager.hasOptionValues(mockEntry_1, mockUserValues);

      expect(result).toBe(false);
    });

    it('returns true when child entry has content', () => {
      const result = manager.hasOptionValues(mockEntry_2, mockUserValues);

      expect(result).toBe(true);
    });

    it('returns false when child entry has no content', () => {
      const emptyUserValues = {
        uuid_3: {
          contents: [],
        },
      } as unknown as UserValues;

      const result = manager.hasOptionValues(mockEntry_2, emptyUserValues);

      expect(result).toBe(false);
    });

    it('returns false when child entry does not exist in userValues', () => {
      const result = manager.hasOptionValues(mockEntry_2, {});

      expect(result).toBe(false);
    });
  });
});
