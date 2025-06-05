import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import { FlattenedDropdownProcessor } from '@common/services/recordGenerator/processors/profileSchema/flattenedDropdownProcessor';
import { ProfileSchemaManager } from '@common/services/recordGenerator/profileSchemaManager';
import { ProfileSchemaProcessorManager } from '@common/services/recordGenerator/processors/profileSchema/profileSchemaProcessorManager';

jest.mock('@common/services/recordGenerator/profileSchemaManager');
jest.mock('@common/services/recordGenerator/processors/profileSchema/profileSchemaProcessorManager');
jest.mock('@common/constants/bibframeMapping.constants', () => ({
  BFLITE_URIS: {
    SOURCE: 'source_uri',
    LINK: 'link_uri',
    LABEL: 'label_uri',
  },
}));

describe('FlattenedDropdownProcessor', () => {
  let processor: FlattenedDropdownProcessor;
  let mockProfileSchemaManager: jest.Mocked<ProfileSchemaManager>;
  let mockProfileSchemaProcessorManager: jest.Mocked<ProfileSchemaProcessorManager>;

  beforeEach(() => {
    mockProfileSchemaManager = new ProfileSchemaManager() as jest.Mocked<ProfileSchemaManager>;
    mockProfileSchemaProcessorManager = new ProfileSchemaProcessorManager(
      mockProfileSchemaManager,
    ) as jest.Mocked<ProfileSchemaProcessorManager>;
    processor = new FlattenedDropdownProcessor(mockProfileSchemaManager, mockProfileSchemaProcessorManager);
  });

  describe('canProcess', () => {
    it('returns true for dropdown type entry with flattenDropdown option set to true', () => {
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

      expect(result).toBe(true);
    });

    it('returns false for dropdown type entry without flattenDropdown option', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.dropdown,
      } as SchemaEntry;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
      };

      const result = processor.canProcess(profileSchemaEntry, recordSchemaEntry);

      expect(result).toBe(false);
    });

    it('returns false for dropdown type entry with flattenDropdown option set to false', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.dropdown,
      } as SchemaEntry;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        options: {
          flattenDropdown: false,
        },
      };

      const result = processor.canProcess(profileSchemaEntry, recordSchemaEntry);

      expect(result).toBe(false);
    });

    it('returns false for non-dropdown type entry with flattenDropdown option', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.literal,
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
  });

  describe('process', () => {
    it('returns empty array when dropdown has no children', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.dropdown,
        uuid: 'dropdown_uuid',
        children: undefined,
      } as SchemaEntry;
      const userValues = {} as UserValues;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        options: {
          flattenDropdown: true,
        },
      };

      const result = processor.process(profileSchemaEntry, userValues, recordSchemaEntry);

      expect(result).toEqual([]);
    });

    it('returns empty array when dropdown has no children with values', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.dropdown,
        uuid: 'dropdown_uuid',
        children: ['option_1_uuid', 'option_2_uuid'],
      } as SchemaEntry;
      const userValues = {} as UserValues;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        options: {
          flattenDropdown: true,
        },
      };

      mockProfileSchemaManager.getSchemaEntry
        .mockReturnValueOnce({
          uuid: 'option_1_uuid',
          type: AdvancedFieldType.dropdownOption,
          children: ['child_1_uuid'],
          uriBFLite: 'option_1_uri',
        } as SchemaEntry)
        .mockReturnValueOnce({
          uuid: 'option_2_uuid',
          type: AdvancedFieldType.dropdownOption,
          children: ['child_2_uuid'],
          uriBFLite: 'option_2_uri',
        } as SchemaEntry);

      mockProfileSchemaManager.hasOptionValues.mockReturnValue(false);

      const result = processor.process(profileSchemaEntry, userValues, recordSchemaEntry);

      expect(result).toEqual([]);
    });

    it('uses default source property when no sourceProperty option is provided', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.dropdown,
        uuid: 'dropdown_uuid',
        children: ['option_1_uuid'],
      } as SchemaEntry;
      const userValues = {
        child_1_uuid: {
          contents: [{ label: 'test value' }],
        },
      } as unknown as UserValues;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        options: {
          flattenDropdown: true,
        },
        properties: {
          option_1_uri: {
            properties: {
              property_1_uri: { type: RecordSchemaEntryType.string },
            },
          },
        },
      } as unknown as RecordSchemaEntry;

      mockProfileSchemaManager.getSchemaEntry
        .mockReturnValueOnce({
          uuid: 'option_1_uuid',
          type: AdvancedFieldType.dropdownOption,
          children: ['child_1_uuid'],
          uriBFLite: 'option_1_uri',
        } as SchemaEntry)
        .mockReturnValueOnce({
          uuid: 'child_1_uuid',
          type: AdvancedFieldType.literal,
          uriBFLite: 'property_1_uri',
        } as SchemaEntry);

      mockProfileSchemaManager.hasOptionValues.mockReturnValue(true);

      const result = processor.process(profileSchemaEntry, userValues, recordSchemaEntry);

      expect(result).toEqual([
        {
          source_uri: ['option_1_uri'],
          property_1_uri: ['test value'],
        },
      ]);
    });

    it('uses custom source property when sourceProperty option is provided', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.dropdown,
        uuid: 'dropdown_uuid',
        children: ['option_1_uuid'],
      } as SchemaEntry;
      const userValues = {
        child_1_uuid: {
          contents: [{ label: 'test value' }],
        },
      } as unknown as UserValues;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        options: {
          flattenDropdown: true,
          sourceProperty: 'custom_source_property',
        },
        properties: {
          option_1_uri: {
            properties: {
              property_1_uri: { type: RecordSchemaEntryType.string },
            },
          },
        },
      } as unknown as RecordSchemaEntry;

      mockProfileSchemaManager.getSchemaEntry
        .mockReturnValueOnce({
          uuid: 'option_1_uuid',
          type: AdvancedFieldType.dropdownOption,
          children: ['child_1_uuid'],
          uriBFLite: 'option_1_uri',
        } as SchemaEntry)
        .mockReturnValueOnce({
          uuid: 'child_1_uuid',
          type: AdvancedFieldType.literal,
          uriBFLite: 'property_1_uri',
        } as SchemaEntry);

      mockProfileSchemaManager.hasOptionValues.mockReturnValue(true);

      const result = processor.process(profileSchemaEntry, userValues, recordSchemaEntry);

      expect(result).toEqual([
        {
          custom_source_property: ['option_1_uri'],
          property_1_uri: ['test value'],
        },
      ]);
    });
  });
});
