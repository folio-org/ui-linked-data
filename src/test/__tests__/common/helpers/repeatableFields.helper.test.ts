import { checkRepeatableGroup } from '@common/helpers/repeatableFields.helper';
import * as SchemaHelper from '@common/helpers/schema.helper';

describe('repeatableFields.helper', () => {
  describe('checkRepeatableGroup', () => {
    const schema = new Map([
      ['testId_1', {} as SchemaEntry],
      ['testId_2', {} as SchemaEntry],
    ]);

    let spyHasChildEntry: jest.SpyInstance<
      boolean,
      [schema: Map<string, SchemaEntry>, children?: string[] | undefined],
      any
    >;

    beforeEach(() => {
      spyHasChildEntry = jest.spyOn(SchemaHelper, 'hasChildEntry');
    });

    test('returns false if level is not Group', () => {
      const options = {
        schema,
        entry: {} as SchemaEntry,
        level: 1,
        isDisabled: false,
      };

      const result = checkRepeatableGroup(options);

      expect(result).toBeFalsy();
    });

    test('returns false if entry is disabled', () => {
      const options = {
        schema,
        entry: {} as SchemaEntry,
        level: 2,
        isDisabled: true,
      };

      const result = checkRepeatableGroup(options);

      expect(result).toBeFalsy();
    });

    test('returns true if entry type is not a group', () => {
      const options = {
        schema,
        entry: { type: 'literal' } as SchemaEntry,
        level: 2,
        isDisabled: false,
      };

      const result = checkRepeatableGroup(options);

      expect(result).toBeTruthy();
    });

    test('returns false if entry has no children', () => {
      spyHasChildEntry.mockReturnValueOnce(false);
      const options = {
        schema,
        entry: { type: 'group', children: [] } as unknown as SchemaEntry,
        level: 2,
        isDisabled: false,
      };

      const result = checkRepeatableGroup(options);

      expect(result).toBeFalsy();
    });

    test('returns true', () => {
      spyHasChildEntry.mockReturnValueOnce(true);
      const options = {
        schema,
        entry: { type: 'group', children: [] } as unknown as SchemaEntry,
        level: 2,
        isDisabled: false,
      };

      const result = checkRepeatableGroup(options);

      expect(result).toBeTruthy();
    });
  });
});
