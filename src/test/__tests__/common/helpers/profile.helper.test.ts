import {
  hasElement,
  generateLookupValue,
  filterUserValues,
  shouldSelectDropdownOption,
} from '@common/helpers/profile.helper';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';
import * as BibframeMappingConstants from '@common/constants/bibframeMapping.constants';
import * as BibframeConstants from '@common/constants/bibframe.constants';
import * as SchemaHelper from '@common/helpers/schema.helper';

describe('profile.helper', () => {
  describe('hasElement', () => {
    test('returns false when entire collection is empty', () => {
      const collection: string[] = [];
      const uri = 'testUri_1';

      const result = hasElement(collection, uri);

      expect(result).toBeFalsy();
    });

    test('returns false when uri is not provided', () => {
      const collection: string[] = ['testUri_1'];

      const result = hasElement(collection);

      expect(result).toBeFalsy();
    });

    test('returns true', () => {
      const collection: string[] = ['testUri_1', 'testUri_2', 'testUri_3'];
      const uri = 'testUri_2';

      const result = hasElement(collection, uri);

      expect(result).toBeTruthy();
    });
  });

  describe('generateLookupValue', () => {
    const mockLookupConstant = getMockedImportedConstant(BibframeConstants, 'LOOKUPS_WITH_SIMPLE_STRUCTURE');
    const mockBFUrisConstant = getMockedImportedConstant(BibframeMappingConstants, 'BFLITE_URIS');

    describe('generateLookupValue for BibframeLite', () => {
      const label = 'test_label';
      const uriBFLite = 'test_uriBFLite';
      const uri = 'test_uri';

      test('returns passed label for lookups with non-hierarchical structure', () => {
        mockLookupConstant([uriBFLite]);

        const result = generateLookupValue({ uriBFLite, label });

        expect(result).toBe(label);
      });

      test('returns generated value', () => {
        mockLookupConstant([]);
        mockBFUrisConstant({ LINK: 'test_label_uri' });
        jest.spyOn(SchemaHelper, 'getLookupLabelKey').mockReturnValue('testLabelKey');
        const testResult = {
          testLabelKey: ['test_label'],
          test_label_uri: ['test_uri'],
        };

        const result = generateLookupValue({ uriBFLite, label, uri });

        expect(result).toEqual(testResult);
      });
    });
  });

  describe('filterUserValues', () => {
    test('returns an empty array', () => {
      const userValues = {
        testId_1: { uuid: 'testId_1', contents: [] },
        testId_2: { uuid: 'testId_2', contents: [] },
      };

      const result = filterUserValues(userValues);

      expect(result).toEqual({});
    });

    test('returns a filtered array of user values', () => {
      const userValues = {
        testId_1: { uuid: 'testId_1', contents: [{ label: '' }] },
        testId_2: { uuid: 'testId_2', contents: [{ label: '' }, { label: 'testLabel_2' }] },
      };
      const testResult = {
        testId_2: { uuid: 'testId_2', contents: [{ label: 'testLabel_2' }] },
      };

      const result = filterUserValues(userValues);

      expect(result).toEqual(testResult);
    });
  });

  describe('shouldSelectDropdownOption', () => {
    const uri = 'testUri';

    test('returns true for the first dropdown option', () => {
      const firstOfSameType = true;

      const result = shouldSelectDropdownOption({ uri, firstOfSameType });

      expect(result).toBeTruthy();
    });

    test('returns true for the option that was saved in the record', () => {
      const firstOfSameType = false;
      const record = [{ testUri: {} }];

      const result = shouldSelectDropdownOption({ uri, record, firstOfSameType });

      expect(result).toBeTruthy();
    });

    test('returns false', () => {
      const result = shouldSelectDropdownOption({ uri });

      expect(result).toBeFalsy();
    });
  });
});
