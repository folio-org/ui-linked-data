import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import { DropdownProcessor } from '@common/services/recordGenerator/processors/profileSchema/dropdownProcessor';
import { ProfileSchemaManager } from '@common/services/recordGenerator/profileSchemaManager';
import { ProfileSchemaProcessorManager } from '@common/services/recordGenerator/processors/profileSchema/profileSchemaProcessorManager';

jest.mock('@common/services/recordGenerator/profileSchemaManager');
jest.mock('@common/services/recordGenerator/processors/profileSchema/profileSchemaProcessorManager');

describe('DropdownProcessor', () => {
  let processor: DropdownProcessor;
  let mockProfileSchemaManager: jest.Mocked<ProfileSchemaManager>;
  let mockProfileSchemaProcessorManager: jest.Mocked<ProfileSchemaProcessorManager>;

  beforeEach(() => {
    mockProfileSchemaManager = new ProfileSchemaManager() as jest.Mocked<ProfileSchemaManager>;
    mockProfileSchemaProcessorManager = new ProfileSchemaProcessorManager(
      mockProfileSchemaManager,
    ) as jest.Mocked<ProfileSchemaProcessorManager>;
    processor = new DropdownProcessor(mockProfileSchemaManager, mockProfileSchemaProcessorManager);
  });

  describe('canProcess', () => {
    it('returns true for dropdown type entry without hiddenWrapper and flattenDropdown options', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.dropdown,
      } as SchemaEntry;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        options: {
          hiddenWrapper: false,
          flattenDropdown: false,
        },
      };

      const result = processor.canProcess(profileSchemaEntry, recordSchemaEntry);

      expect(result).toBe(true);
    });

    it('returns true for enumerated type entry without hiddenWrapper and flattenDropdown options', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.enumerated,
      } as SchemaEntry;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        options: {
          hiddenWrapper: false,
          flattenDropdown: false,
        },
      };

      const result = processor.canProcess(profileSchemaEntry, recordSchemaEntry);

      expect(result).toBe(true);
    });

    it('returns true for dropdown type entry with no options', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.dropdown,
      } as SchemaEntry;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
      };

      const result = processor.canProcess(profileSchemaEntry, recordSchemaEntry);

      expect(result).toBe(true);
    });

    it('returns true for enumerated type entry with no options', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.enumerated,
      } as SchemaEntry;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
      };

      const result = processor.canProcess(profileSchemaEntry, recordSchemaEntry);

      expect(result).toBe(true);
    });

    it('returns false for dropdown type entry with hiddenWrapper option', () => {
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

      expect(result).toBe(false);
    });

    it('returns false for dropdown type entry with flattenDropdown option', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.dropdown,
      } as SchemaEntry;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        options: {
          flattenDropdown: true,
        },
      };

      const result = processor.canProcess(profileSchemaEntry, recordSchemaEntry);

      expect(result).toBe(false);
    });

    it('returns false for enumerated type entry with flattenDropdown option', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.enumerated,
      } as SchemaEntry;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        options: {
          flattenDropdown: true,
        },
      };

      const result = processor.canProcess(profileSchemaEntry, recordSchemaEntry);

      expect(result).toBe(false);
    });

    it('returns false for non_dropdown type entry', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.literal,
      } as SchemaEntry;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
      };

      const result = processor.canProcess(profileSchemaEntry, recordSchemaEntry);

      expect(result).toBe(false);
    });
  });

  describe('process', () => {
    it('returns empty array when dropdown has no children', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.dropdown,
        uuid: 'dropdown_uuid',
        children: undefined,
      } as SchemaEntry;
      const userValues: UserValues = {};
      const selectedEntries: string[] = [];
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
      };

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([]);
    });

    it('returns empty array when dropdown has children but no option entries', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.dropdown,
        uuid: 'dropdown_uuid',
        children: ['option_1_uuid', 'option_2_uuid'],
      } as SchemaEntry;
      const userValues: UserValues = {};
      const selectedEntries: string[] = [];
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
      };

      mockProfileSchemaManager.getSchemaEntry.mockReturnValue(undefined);

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([]);
      expect(mockProfileSchemaManager.getSchemaEntry).toHaveBeenCalledWith('option_1_uuid');
      expect(mockProfileSchemaManager.getSchemaEntry).toHaveBeenCalledWith('option_2_uuid');
    });

    it('returns empty array when dropdown has option entries without children', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.dropdown,
        uuid: 'dropdown_uuid',
        children: ['option_1_uuid'],
      } as SchemaEntry;
      const optionEntry = {
        uuid: 'option_1_uuid',
        uriBFLite: 'option_1',
        children: undefined,
      } as SchemaEntry;
      const userValues: UserValues = {};
      const selectedEntries: string[] = [];
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
      } as RecordSchemaEntry;

      mockProfileSchemaManager.getSchemaEntry.mockReturnValue(optionEntry);
      mockProfileSchemaManager.hasOptionValues.mockReturnValue(false);

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([]);
      expect(mockProfileSchemaManager.getSchemaEntry).toHaveBeenCalledWith('option_1_uuid');
    });

    it('returns empty array when option entries do not have uriBFLite', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.dropdown,
        uuid: 'dropdown_uuid',
        children: ['option_1_uuid'],
      } as SchemaEntry;
      const optionEntry = {
        uuid: 'option_1_uuid',
        uriBFLite: undefined,
        children: ['child_1_uuid'],
      } as SchemaEntry;
      const userValues: UserValues = {};
      const selectedEntries = ['option_1_uuid'];
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
      };

      mockProfileSchemaManager.getSchemaEntry.mockReturnValue(optionEntry);
      mockProfileSchemaManager.hasOptionValues.mockReturnValue(true);

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([]);
      expect(mockProfileSchemaManager.getSchemaEntry).toHaveBeenCalledWith('option_1_uuid');
      expect(mockProfileSchemaManager.hasOptionValues).toHaveBeenCalledWith(optionEntry, userValues);
    });

    it('returns array with processed option entries', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.dropdown,
        uuid: 'dropdown_uuid',
        children: ['option_1_uuid'],
      } as SchemaEntry;
      const optionEntry = {
        uuid: 'option_1_uuid',
        uriBFLite: 'option_1',
        children: ['child_1_uuid'],
      } as SchemaEntry;
      const childEntry = {
        uuid: 'child_1_uuid',
        uriBFLite: 'child_1',
        type: AdvancedFieldType.literal,
      } as SchemaEntry;
      const userValues = {
        child_1_uuid: {
          uuid: 'child_1_uuid',
          contents: [{ label: 'child value' }],
        },
      } as unknown as UserValues;
      const selectedEntries = ['option_1_uuid'];
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        properties: {
          option_1: {
            type: RecordSchemaEntryType.object,
            properties: {
              child_1: { type: RecordSchemaEntryType.string },
            },
          },
        },
      } as RecordSchemaEntry;

      mockProfileSchemaManager.getSchemaEntry.mockReturnValueOnce(optionEntry).mockReturnValueOnce(childEntry);
      mockProfileSchemaManager.hasOptionValues.mockReturnValue(true);

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([{ option_1: { child_1: ['child value'] } }]);
      expect(mockProfileSchemaManager.getSchemaEntry).toHaveBeenCalledWith('option_1_uuid');
      expect(mockProfileSchemaManager.getSchemaEntry).toHaveBeenCalledWith('child_1_uuid');
      expect(mockProfileSchemaManager.hasOptionValues).toHaveBeenCalledWith(optionEntry, userValues);
    });

    it('skips option entries that have no user values', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.dropdown,
        uuid: 'dropdown_uuid',
        children: ['option_1_uuid', 'option_2_uuid'],
      } as SchemaEntry;
      const option1Entry = {
        uuid: 'option_1_uuid',
        uriBFLite: 'option_1',
        children: ['child_1_uuid'],
      } as SchemaEntry;
      const option2Entry = {
        uuid: 'option_2_uuid',
        uriBFLite: 'option_2',
        children: ['child_2_uuid'],
      } as SchemaEntry;
      const childEntry = {
        uuid: 'child_1_uuid',
        uriBFLite: 'child_1',
        type: AdvancedFieldType.literal,
      } as SchemaEntry;
      const userValues = {
        child_1_uuid: {
          uuid: 'child_1_uuid',
          contents: [{ label: 'child value' }],
        },
      } as unknown as UserValues;
      const selectedEntries = ['option_1_uuid', 'option_2_uuid'];
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        properties: {
          option_1: {
            type: RecordSchemaEntryType.object,
            properties: {
              child_1: { type: RecordSchemaEntryType.string },
            },
          },
          option_2: {
            type: RecordSchemaEntryType.object,
            properties: {
              child_2: { type: RecordSchemaEntryType.string },
            },
          },
        },
      } as RecordSchemaEntry;

      mockProfileSchemaManager.getSchemaEntry.mockImplementation(uuid => {
        if (uuid === 'option_1_uuid') return option1Entry;
        if (uuid === 'option_2_uuid') return option2Entry;
        if (uuid === 'child_1_uuid') return childEntry;
        return undefined;
      });
      mockProfileSchemaManager.hasOptionValues.mockImplementation(entry => entry.uuid === 'option_1_uuid');

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([{ option_1: { child_1: ['child value'] } }]);
      expect(mockProfileSchemaManager.getSchemaEntry).toHaveBeenCalledWith('option_1_uuid');
      expect(mockProfileSchemaManager.getSchemaEntry).toHaveBeenCalledWith('option_2_uuid');
      expect(mockProfileSchemaManager.getSchemaEntry).toHaveBeenCalledWith('child_1_uuid');
      expect(mockProfileSchemaManager.hasOptionValues).toHaveBeenCalledWith(option1Entry, userValues);
      expect(mockProfileSchemaManager.hasOptionValues).toHaveBeenCalledWith(option2Entry, userValues);
    });

    it('processes child entries with complex type using profileSchemaProcessorManager', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.dropdown,
        uuid: 'dropdown_uuid',
        children: ['option_1_uuid'],
      } as SchemaEntry;
      const optionEntry = {
        uuid: 'option_1_uuid',
        uriBFLite: 'option_1',
        children: ['child_1_uuid'],
      } as SchemaEntry;
      const childEntry = {
        uuid: 'child_1_uuid',
        uriBFLite: 'child_1',
        type: AdvancedFieldType.complex,
      } as SchemaEntry;
      const userValues = {
        child_1_uuid: {
          uuid: 'child_1_uuid',
          contents: [{ label: 'child value' }],
        },
      } as unknown as UserValues;
      const selectedEntries = ['option_1_uuid'];
      const childRecordSchemaEntry = { type: RecordSchemaEntryType.string };
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        properties: {
          option_1: {
            type: RecordSchemaEntryType.object,
            properties: {
              child_1: childRecordSchemaEntry,
            },
          },
        },
      } as RecordSchemaEntry;

      mockProfileSchemaManager.getSchemaEntry.mockReturnValueOnce(optionEntry).mockReturnValueOnce(childEntry);
      mockProfileSchemaManager.hasOptionValues.mockReturnValue(true);
      mockProfileSchemaProcessorManager.process.mockReturnValue(['processed value']);

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([{ option_1: { child_1: ['processed value'] } }]);
      expect(mockProfileSchemaManager.getSchemaEntry).toHaveBeenCalledWith('option_1_uuid');
      expect(mockProfileSchemaManager.getSchemaEntry).toHaveBeenCalledWith('child_1_uuid');
      expect(mockProfileSchemaManager.hasOptionValues).toHaveBeenCalledWith(optionEntry, userValues);
      expect(mockProfileSchemaProcessorManager.process).toHaveBeenCalledWith({
        profileSchemaEntry: childEntry,
        recordSchemaEntry: childRecordSchemaEntry,
        userValues,
        selectedEntries,
      });
    });
  });
});
