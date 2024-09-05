import {
  generateEmptyValueUuid,
  getLinkedField,
  updateLinkedFieldValue,
  getUpdatedSelectedEntries,
} from '@common/helpers/complexLookup.helper';
import * as ComplexLookupConstants from '@common/constants/complexLookup.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';

const mockImportedConstant = getMockedImportedConstant(ComplexLookupConstants, 'COMPLEX_LOOKUPS_LINKED_FIELDS_MAPPING');
mockImportedConstant({
  testField: {
    testValue: { bf2Uri: 'testUri' },
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
          uri: 'testUri',
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
});
