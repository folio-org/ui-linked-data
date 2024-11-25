import { RecordGenerator, SchemaTraverser } from '@common/services/record';
import * as ProfileHelper from '@common/helpers/profile.helper';

describe('RecordGenerator', () => {
  let recordGenerator: RecordGenerator;
  let schemaTraverserMock: SchemaTraverser;

  beforeEach(() => {
    schemaTraverserMock = {
      init: jest.fn().mockReturnThis(),
      traverse: jest.fn(),
    } as unknown as SchemaTraverser;

    recordGenerator = new RecordGenerator(schemaTraverserMock);
  });

  describe('init', () => {
    it('sets the schema, initKey, userValues, and selectedEntries', () => {
      const schema = new Map<string, SchemaEntry>();
      const initKey = 'testKey';
      const userValues = { key_1: { contents: [] } } as unknown as UserValues;
      const selectedEntries = ['entry 1', 'entry 2'];

      recordGenerator.init({ schema, initKey, userValues, selectedEntries });

      expect(recordGenerator['schema']).toBe(schema);
      expect(recordGenerator['initKey']).toBe(initKey);
      expect(recordGenerator['userValues']).toBe(userValues);
      expect(recordGenerator['selectedEntries']).toEqual(selectedEntries);
    });
  });

  describe('generate', () => {
    it('returns undefined if userValues is empty', () => {
      recordGenerator['userValues'] = {};
      recordGenerator['schema'] = new Map<string, SchemaEntry>([['key_1', {} as SchemaEntry]]);
      recordGenerator['initKey'] = 'key_1';

      const result = recordGenerator.generate();

      expect(result).toBeUndefined();
      expect(schemaTraverserMock.init).not.toHaveBeenCalled();
      expect(schemaTraverserMock.traverse).not.toHaveBeenCalled();
    });

    it('returns undefined if schema is empty', () => {
      recordGenerator['userValues'] = { key_1: { contents: [] } } as unknown as UserValues;
      recordGenerator['schema'] = new Map<string, SchemaEntry>();
      recordGenerator['initKey'] = 'key_1';

      const result = recordGenerator.generate();

      expect(result).toBeUndefined();
      expect(schemaTraverserMock.init).not.toHaveBeenCalled();
      expect(schemaTraverserMock.traverse).not.toHaveBeenCalled();
    });

    it('returns undefined if initKey is null', () => {
      recordGenerator['userValues'] = { key_1: { contents: [] } } as unknown as UserValues;
      recordGenerator['schema'] = new Map<string, SchemaEntry>([['key_1', {} as SchemaEntry]]);
      recordGenerator['initKey'] = null;

      const result = recordGenerator.generate();

      expect(result).toBeUndefined();
      expect(schemaTraverserMock.init).not.toHaveBeenCalled();
      expect(schemaTraverserMock.traverse).not.toHaveBeenCalled();
    });

    it('calls "schemaTraverser.init" and "traverse" when all conditions are met', () => {
      const filteredValues = { key_1: { contents: [] } } as unknown as UserValues;
      jest.spyOn(ProfileHelper, 'filterUserValues').mockReturnValue(filteredValues);
      schemaTraverserMock.traverse = jest.fn(() => {});

      recordGenerator['userValues'] = { key_1: { contents: [] } } as unknown as UserValues;
      recordGenerator['schema'] = new Map<string, SchemaEntry>([['key_1', {} as SchemaEntry]]);
      recordGenerator['initKey'] = 'key_1';
      recordGenerator['selectedEntries'] = ['entry 1'];

      const result = recordGenerator.generate();

      expect(schemaTraverserMock.init).toHaveBeenCalledWith({
        schema: recordGenerator['schema'],
        userValues: filteredValues,
        selectedEntries: recordGenerator['selectedEntries'],
        initialContainer: {},
      });
      expect(schemaTraverserMock.traverse).toHaveBeenCalledWith({ key: 'key_1' });
      expect(result).toEqual({});
    });
  });
});
