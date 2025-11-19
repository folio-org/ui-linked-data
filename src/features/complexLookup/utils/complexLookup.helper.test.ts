import {
  generateEmptyValueUuid,
  getLinkedField,
  updateLinkedFieldValue,
  getUpdatedSelectedEntries,
  generateValidationRequestBody,
} from '@/features/complexLookup/utils/complexLookup.helper';
import * as ComplexLookupConstants from '@/features/complexLookup/constants/complexLookup.constants';
import { AdvancedFieldType } from '@/common/constants/uiControls.constants';
import { getMockedImportedConstant } from '@/test/__mocks__/common/constants/constants.mock';
import { AuthorityValidationTarget } from '@/features/complexLookup/constants/complexLookup.constants';

const mockImportedConstant = getMockedImportedConstant(ComplexLookupConstants, 'COMPLEX_LOOKUPS_LINKED_FIELDS_MAPPING');
mockImportedConstant({
  testField: {
    testValue: { uriBFLite: 'testUri' },
  },
});

describe('complexLookup.helper', () => {
  describe('generateEmptyValueUuid', () => {
    it('appends the suffix to the UUID', () => {
      const uuid = 'testUuid';
      const testResult = `${uuid}_${ComplexLookupConstants.EMPTY_LINKED_DROPDOWN_OPTION_SUFFIX}`;

      const result = generateEmptyValueUuid(uuid);

      expect(result).toBe(testResult);
    });
  });

  describe('getLinkedField', () => {
    const schemaEntry = {
      path: ['dependentUuid_1'],
      uuid: 'dependentUuid_1',
      children: [],
    };
    const schema = new Map([['dependentUuid_1', schemaEntry]]);

    it('returns the linked field from the schema', () => {
      const linkedEntry = { dependent: 'dependentUuid_1' };
      const result = getLinkedField({ schema, linkedEntry });

      expect(result).toEqual(schemaEntry);
    });

    it('returns undefined when "linkedEntry" is not provided', () => {
      const result = getLinkedField({ schema });

      expect(result).toBeUndefined();
    });

    it('returns undefined when "linkedEntry.dependent" is not found in the schema', () => {
      const linkedEntry = { dependent: 'dependentUuid_2' };
      const result = getLinkedField({ schema, linkedEntry });

      expect(result).toBeUndefined();
    });
  });

  describe('updateLinkedFieldValue', () => {
    const schema = new Map([
      [
        'childUuid',
        {
          path: ['childUuid'],
          uuid: 'childUuid',
          type: AdvancedFieldType.dropdownOption,
          uriBFLite: 'testUri',
        },
      ],
    ]);
    const linkedField = { children: ['childUuid'] } as SchemaEntry;
    const lookupConfig = { linkedField: 'testField' } as ComplexLookupsConfigEntry;
    const linkedFieldValue = 'testValue';

    it('updates the linked field value based on the lookup configuration', () => {
      const result = updateLinkedFieldValue({ schema, linkedField, linkedFieldValue, lookupConfig });

      expect(result).toEqual(schema.get('childUuid'));
    });

    it('returns undefined when the dropdown option is not found', () => {
      const result = updateLinkedFieldValue({
        schema,
        linkedField,
        linkedFieldValue: 'nonExistentValue',
        lookupConfig,
      });

      expect(result).toBeUndefined();
    });
  });

  describe('getUpdatedSelectedEntries', () => {
    const selectedEntries = ['entry_1', 'entry_2'];
    const linkedFieldChildren = ['child_1', 'child_2'];
    const newValue = 'newEntry';

    const selectedEntriesService = {
      set: jest.fn(),
      removeMultiple: jest.fn(),
      addNew: jest.fn(),
      get: jest.fn(),
    };

    it('updates the selected entries', () => {
      const testResult = ['entry_1', 'newEntry'];
      (selectedEntriesService.get as jest.Mock).mockReturnValue(testResult);

      const result = getUpdatedSelectedEntries({
        selectedEntries,
        selectedEntriesService: selectedEntriesService as unknown as ISelectedEntriesService,
        linkedFieldChildren,
        newValue,
      });

      expect(selectedEntriesService.set).toHaveBeenCalledWith(selectedEntries);
      expect(selectedEntriesService.removeMultiple).toHaveBeenCalledWith(linkedFieldChildren);
      expect(selectedEntriesService.addNew).toHaveBeenCalledWith(undefined, newValue);
      expect(result).toEqual(testResult);
    });

    it('returns the original selected entries', () => {
      const result = getUpdatedSelectedEntries({ selectedEntries });

      expect(result).toEqual(selectedEntries);
    });
  });

  describe('generateValidationRequestBody', () => {
    const mockMarcContent = {
      field_1: 'value 1',
      field_2: 'value 2',
    };

    const mockMarcData = {
      parsedRecord: {
        content: mockMarcContent,
      },
    } as unknown as MarcDTO;

    it('returns empty object when marcData is null', () => {
      const result = generateValidationRequestBody(null);

      expect(result).toEqual({});
    });

    it('returns correct request body with default target', () => {
      const result = generateValidationRequestBody(mockMarcData);

      expect(result).toEqual({
        rawMarc: JSON.stringify(mockMarcContent, null, 2),
        target: AuthorityValidationTarget.CreatorOfWork,
      });
    });

    it('returns correct request body with custom target', () => {
      const customTarget = 'CUSTOM_TARGET';
      const result = generateValidationRequestBody(mockMarcData, customTarget as AuthorityValidationTargetType);

      expect(result).toEqual({
        rawMarc: JSON.stringify(mockMarcContent, null, 2),
        target: customTarget,
      });
    });

    it('returns correct request body with escaped content', () => {
      const marcDataWithSpecialChars = {
        parsedRecord: {
          content: {
            field: 'value\r\nwith\rlinebreaks',
          },
        },
      } as unknown as MarcDTO;

      const result = generateValidationRequestBody(marcDataWithSpecialChars);

      expect(result.rawMarc).toContain('\\r');
      expect(result.rawMarc).toContain('\\n');
    });
  });
});
