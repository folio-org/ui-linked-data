import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import { UnwrappedDropdownOptionProcessor } from '@common/services/recordGenerator/processors/profileSchema/unwrappedDropdownOptionProcessor';
import { ProfileSchemaManager } from '@common/services/recordGenerator/profileSchemaManager';
import { ProfileSchemaProcessorManager } from '@common/services/recordGenerator/processors/profileSchema/profileSchemaProcessorManager';

jest.mock('@common/services/recordGenerator/profileSchemaManager');
jest.mock('@common/services/recordGenerator/processors/profileSchema/profileSchemaProcessorManager');

describe('UnwrappedDropdownOptionProcessor', () => {
  let processor: UnwrappedDropdownOptionProcessor;
  let mockProfileSchemaManager: jest.Mocked<ProfileSchemaManager>;
  let mockProfileSchemaProcessorManager: jest.Mocked<ProfileSchemaProcessorManager>;

  beforeEach(() => {
    mockProfileSchemaManager = new ProfileSchemaManager() as jest.Mocked<ProfileSchemaManager>;
    mockProfileSchemaProcessorManager = new ProfileSchemaProcessorManager(
      mockProfileSchemaManager,
    ) as jest.Mocked<ProfileSchemaProcessorManager>;
    processor = new UnwrappedDropdownOptionProcessor(mockProfileSchemaManager, mockProfileSchemaProcessorManager);
  });

  describe('canProcess', () => {
    it('returns true for dropdown type entry with hiddenWrapper option set to true', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.dropdown,
      } as SchemaEntry;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        options: {
          hiddenWrapper: true,
        },
      };

      const result = processor.canProcess(profileSchemaEntry, recordSchemaEntry);

      expect(result).toBe(true);
    });

    it('returns false for dropdown type entry without hiddenWrapper option', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.dropdown,
      } as SchemaEntry;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
      };

      const result = processor.canProcess(profileSchemaEntry, recordSchemaEntry);

      expect(result).toBe(false);
    });

    it('returns false for dropdown type entry with hiddenWrapper option set to false', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.dropdown,
      } as SchemaEntry;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        options: {
          hiddenWrapper: false,
        },
      };

      const result = processor.canProcess(profileSchemaEntry, recordSchemaEntry);

      expect(result).toBe(false);
    });

    it('returns false for non-dropdown type entry with hiddenWrapper option', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.simple,
      } as SchemaEntry;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        options: {
          hiddenWrapper: true,
        },
      };

      const result = processor.canProcess(profileSchemaEntry, recordSchemaEntry);

      expect(result).toBe(false);
    });
  });

  describe('process', () => {
    it('returns empty array when dropdown has no children', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.dropdown,
        children: undefined,
      } as SchemaEntry;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        options: {
          hiddenWrapper: true,
        },
      };
      const userValues = {};

      const result = processor.process(profileSchemaEntry, userValues, recordSchemaEntry);

      expect(result).toEqual([]);
    });

    it('returns empty array when dropdown has children but no option entries', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.dropdown,
        children: ['option_1', 'option_2'],
      } as SchemaEntry;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        options: {
          hiddenWrapper: true,
        },
      };
      const userValues = {};

      mockProfileSchemaManager.getSchemaEntry.mockReturnValue(undefined);
      mockProfileSchemaManager.hasOptionValues.mockReturnValue(false);

      const result = processor.process(profileSchemaEntry, userValues, recordSchemaEntry);

      expect(result).toEqual([]);
      expect(mockProfileSchemaManager.getSchemaEntry).toHaveBeenCalledWith('option_1');
      expect(mockProfileSchemaManager.getSchemaEntry).toHaveBeenCalledWith('option_2');
    });

    it('returns empty array when option entries have no values', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.dropdown,
        children: ['option_1'],
      } as SchemaEntry;
      const optionEntry = {
        uuid: 'option_1',
        children: ['child_1'],
        uriBFLite: 'option_uri',
      } as SchemaEntry;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        options: {
          hiddenWrapper: true,
        },
        fields: {
          option_uri: {
            type: RecordSchemaEntryType.object,
            fields: {
              child_uri: { type: RecordSchemaEntryType.string },
            },
          },
        },
      };
      const userValues = {};

      mockProfileSchemaManager.getSchemaEntry
        .mockReturnValueOnce(optionEntry)
        .mockReturnValueOnce({ uuid: 'child_1', uriBFLite: 'child_uri' } as SchemaEntry);
      mockProfileSchemaManager.hasOptionValues.mockReturnValue(true);

      const result = processor.process(profileSchemaEntry, userValues, recordSchemaEntry);

      expect(result).toEqual([]);
      expect(mockProfileSchemaManager.getSchemaEntry).toHaveBeenCalledWith('option_1');
      expect(mockProfileSchemaManager.getSchemaEntry).toHaveBeenCalledWith('child_1');
    });

    it('skips option entries with empty result', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.dropdown,
        children: ['option_1'],
      } as SchemaEntry;
      const optionEntry = {
        uuid: 'option_1',
        children: ['child_1'],
        uriBFLite: 'option_uri',
      } as SchemaEntry;
      const childEntry = {
        uuid: 'child_1',
        uriBFLite: 'child_uri',
      } as SchemaEntry;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        options: {
          hiddenWrapper: true,
        },
        fields: {
          option_uri: {
            type: RecordSchemaEntryType.object,
            fields: {},
          },
        },
      };
      const userValues = {};

      mockProfileSchemaManager.getSchemaEntry.mockReturnValueOnce(optionEntry).mockReturnValueOnce(childEntry);
      mockProfileSchemaManager.hasOptionValues.mockReturnValue(true);

      const result = processor.process(profileSchemaEntry, userValues, recordSchemaEntry);

      expect(result).toEqual([]);
    });
  });
});
