import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { GROUP_BY_LEVEL, GROUP_CONTENTS_LEVEL, PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import { checkShouldGroupWrap, getPreviewFieldsConditions } from '@common/helpers/preview.helper';

describe('preview.helper', () => {
  describe('checkShouldGroupWrap', () => {
    const baseEntry: SchemaEntry = {
      type: AdvancedFieldType.group,
      children: [],
      path: ['root'],
      uuid: 'test-uuid',
    };

    test('returns true for group type at GROUP_BY_LEVEL without children', () => {
      expect(checkShouldGroupWrap(GROUP_BY_LEVEL, baseEntry)).toBe(true);
    });

    test('returns false for non-group type at GROUP_BY_LEVEL', () => {
      expect(checkShouldGroupWrap(GROUP_BY_LEVEL, { ...baseEntry, type: AdvancedFieldType.literal })).toBe(false);
    });
  });

  describe('getPreviewFieldsConditions', () => {
    const baseParams = {
      entry: {
        displayName: 'Test Field',
        type: AdvancedFieldType.literal,
        children: [],
        bfid: '',
        path: ['root'],
        uuid: 'test-uuid',
      },
      level: GROUP_BY_LEVEL,
      userValues: {},
      uuid: 'test-uuid',
      schema: new Map([
        [
          'test-uuid',
          {
            path: ['root'],
            uuid: 'test-uuid',
          },
        ],
      ]),
      isOnBranchWithUserValue: false,
      altDisplayNames: {},
      hideEntities: false,
      isEntity: false,
      forceRenderAllTopLevelEntities: false,
    };

    test('returns correct conditions for basic text field', () => {
      const result = getPreviewFieldsConditions(baseParams);

      expect(result).toEqual({
        isGroupable: true,
        shouldRenderLabelOrPlaceholders: true,
        shouldRenderValuesOrPlaceholders: true,
        shouldRenderPlaceholders: true,
        isDependentDropdown: false,
        displayNameWithAltValue: 'Test Field',
        isBlock: true,
        isBlockContents: false,
        isInstance: false,
        wrapEntities: false,
      });
    });

    test('handles dropdown with controlled field', () => {
      const result = getPreviewFieldsConditions({
        ...baseParams,
        entry: {
          ...baseParams.entry,
          type: AdvancedFieldType.dropdown,
          linkedEntry: {
            controlledBy: 'someField',
          },
        },
      });

      expect(result.isDependentDropdown).toBe(true);
    });

    test('handles dependent dropdown with undefined linkedEntry', () => {
      const result = getPreviewFieldsConditions({
        ...baseParams,
        entry: {
          ...baseParams.entry,
          type: AdvancedFieldType.dropdown,
          linkedEntry: undefined,
        },
      });

      expect(result.isDependentDropdown).toBe(false);
    });

    test('uses alternative display name when available', () => {
      const result = getPreviewFieldsConditions({
        ...baseParams,
        entry: {
          ...baseParams.entry,
          displayName: 'Test Field',
        },
        altDisplayNames: {
          'Test Field': 'Alternative Name',
        },
      });

      expect(result.displayNameWithAltValue).toBe('Alternative Name');
    });

    test('handles instance bfid correctly', () => {
      const result = getPreviewFieldsConditions({
        ...baseParams,
        entry: {
          ...baseParams.entry,
          bfid: PROFILE_BFIDS.INSTANCE,
        },
      });

      expect(result.isInstance).toBe(true);
    });

    test('handles entity with forceRenderAllTopLevelEntities', () => {
      const result = getPreviewFieldsConditions({
        ...baseParams,
        isEntity: true,
        forceRenderAllTopLevelEntities: true,
      });

      expect(result.wrapEntities).toBe(true);
    });

    test('handles dropdown with only dropdown option children', () => {
      const schema = new Map([
        [
          'child1',
          {
            type: AdvancedFieldType.dropdownOption,
            path: ['root', 'child1'],
            uuid: 'child1',
          },
        ],
        [
          'child2',
          {
            type: AdvancedFieldType.dropdownOption,
            path: ['root', 'child2'],
            uuid: 'child2',
          },
        ],
      ]);

      const result = getPreviewFieldsConditions({
        ...baseParams,
        entry: {
          ...baseParams.entry,
          children: ['child1', 'child2'],
        },
        schema,
      });

      expect(result.shouldRenderValuesOrPlaceholders).toBe(true);
    });

    test('handles branch with user values', () => {
      const result = getPreviewFieldsConditions({
        ...baseParams,
        userValues: {
          'test-uuid': {
            uuid: 'test-uuid',
            contents: [{ label: 'some value' }],
          },
        },
      });

      expect(result.shouldRenderLabelOrPlaceholders).toBe(true);
    });

    test('handles content level blocks', () => {
      const result = getPreviewFieldsConditions({
        ...baseParams,
        level: GROUP_CONTENTS_LEVEL,
      });

      expect(result.isBlockContents).toBe(true);
      expect(result.isBlock).toBe(false);
    });

    test('handles empty children array', () => {
      const result = getPreviewFieldsConditions({
        ...baseParams,
        entry: {
          ...baseParams.entry,
          children: [],
        },
      });

      expect(result.shouldRenderValuesOrPlaceholders).toBe(true);
    });

    test('handles undefined children', () => {
      const result = getPreviewFieldsConditions({
        ...baseParams,
        entry: {
          ...baseParams.entry,
          children: undefined,
        },
      });

      expect(result.shouldRenderValuesOrPlaceholders).toBe(true);
    });

    test('handles non-dropdown children correctly', () => {
      const schema = new Map([
        [
          'child1',
          {
            type: AdvancedFieldType.literal,
            path: ['root', 'child1'],
            uuid: 'child1',
          },
        ],
      ]);

      const result = getPreviewFieldsConditions({
        ...baseParams,
        entry: {
          ...baseParams.entry,
          children: ['child1'],
        },
        schema,
      });

      expect(result.shouldRenderValuesOrPlaceholders).toBe(false);
    });

    test('handles entities with forceRenderAllTopLevelEntities false', () => {
      const result = getPreviewFieldsConditions({
        ...baseParams,
        isEntity: true,
        forceRenderAllTopLevelEntities: false,
      });

      expect(result.wrapEntities).toBe(false);
    });

    test('handles branch without user values but with children', () => {
      const schema = new Map([
        [
          'child1',
          {
            type: AdvancedFieldType.literal,
            path: ['root', 'child1'],
            uuid: 'child1',
          },
        ],
      ]);

      const result = getPreviewFieldsConditions({
        ...baseParams,
        entry: {
          ...baseParams.entry,
          children: ['child1'],
        },
        schema,
        isOnBranchWithUserValue: false,
      });

      expect(result.shouldRenderPlaceholders).toBe(true);
    });

    test('handles branch end with complex type', () => {
      const result = getPreviewFieldsConditions({
        ...baseParams,
        entry: {
          ...baseParams.entry,
          type: AdvancedFieldType.complex,
          children: undefined,
        },
        userValues: {
          'test-uuid': {
            uuid: 'test-uuid',
            contents: [{ label: 'some value' }],
          },
        },
      });

      expect(result.shouldRenderLabelOrPlaceholders).toBe(false);
    });
  });
});
