import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { checkRepeatableGroup, checkRepeatableSubcomponent } from '@common/helpers/repeatableFields.helper';
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

    test('returns false if entry is not repeatable', () => {
      const options = {
        schema,
        entry: {
          constraints: {
            repeatable: false,
          },
        } as SchemaEntry,
        level: 2,
        isDisabled: false,
      };

      const result = checkRepeatableGroup(options);

      expect(result).toBeFalsy();
    });

    test('returns true if no constraints', () => {
      const options = {
        schema,
        entry: {} as SchemaEntry,
        level: 2,
        isDisabled: false,
      };

      const result = checkRepeatableGroup(options);

      expect(result).toBeTruthy();
    });

    test('returns true if repeatable not set in constraints', () => {
      const options = {
        schema,
        entry: {
          constraints: {},
        } as SchemaEntry,
        level: 2,
        isDisabled: false,
      };

      const result = checkRepeatableGroup(options);

      expect(result).toBeTruthy();
    });

    test('returns true when repeatable constraint is true', () => {
      const options = {
        schema,
        entry: {
          constraints: {
            repeatable: true,
          },
        } as SchemaEntry,
        level: 2,
        isDisabled: false,
      };

      const result = checkRepeatableGroup(options);

      expect(result).toBeTruthy();
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

  describe('checkRepeatableSubcomponent', () => {
    test('returns true for repeatable, enabled literal field', () => {
      const options = {
        entry: {
          type: AdvancedFieldType.literal,
          constraints: {
            repeatable: true,
          },
          path: [''],
          uuid: '',
        } as SchemaEntry,
        isDisabled: false,
      };

      const result = checkRepeatableSubcomponent(options);

      expect(result).toBeTruthy();
    });

    test('returns false for repeatable, disabled literal field', () => {
      const options = {
        entry: {
          type: AdvancedFieldType.literal,
          constraints: {
            repeatable: true,
          },
          path: [''],
          uuid: '',
        } as SchemaEntry,
        isDisabled: true,
      };

      const result = checkRepeatableSubcomponent(options);

      expect(result).toBeFalsy();
    });

    test('returns false for non-repeatable, enabled literal field', () => {
      const options = {
        entry: {
          type: AdvancedFieldType.literal,
          constraints: {
            repeatable: false,
          },
          path: [''],
          uuid: '',
        } as SchemaEntry,
        isDisabled: false,
      };

      const result = checkRepeatableSubcomponent(options);

      expect(result).toBeFalsy();
    });

    test('returns false for repeatable, enabled non-literal field', () => {
      const options = {
        entry: {
          type: AdvancedFieldType.simple,
          constraints: {
            repeatable: true,
          },
          path: [''],
          uuid: '',
        } as SchemaEntry,
        isDisabled: false,
      };

      const result = checkRepeatableSubcomponent(options);

      expect(result).toBeFalsy();
    });
  });
});
