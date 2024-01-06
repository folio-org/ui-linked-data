import * as ProfileHelper from '@common/helpers/profile.helper';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';
import * as BibframeMappingConstants from '@common/constants/bibframeMapping.constants';
import * as BibframeConstants from '@common/constants/bibframe.constants';
import * as SchemaHelper from '@common/helpers/schema.helper';

const { hasElement, generateLookupValue, getMappedLookupValue, filterUserValues, shouldSelectDropdownOption } =
  ProfileHelper;

const uri = 'test_uri';
const nonBFMappedGroup = {
  uri: 'testPropertyURI',
  data: {
    container: { key: 'testContainer' },
    testKey_1: { key: 'testValue_1' },
  },
};

describe('profile.helper', () => {
  const mockTypeMapConstant = getMockedImportedConstant(BibframeMappingConstants, 'TYPE_MAP');

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

      test('returns generated data for non-BibFrame Lite mapped group if it has a value with LoC URI', () => {
        mockLookupConstant([]);
        mockBFUrisConstant({ LINK: 'test_label_uri' });
        const spyGetMappedLookupValue = jest
          .spyOn(ProfileHelper, 'getMappedLookupValue')
          .mockReturnValue('testMappedLookupValue');
        const uri = 'http://id.loc.gov/test';
        const testResult = 'testMappedLookupValue';

        const result = generateLookupValue({ uriBFLite, label, uri, nonBFMappedGroup });

        expect(result).toEqual(testResult);
        expect(spyGetMappedLookupValue).toHaveBeenCalledWith({ uri, nonBFMappedGroup });
      });

      test('returns generated data for non-BibFrame Lite mapped group if it does not have a value with LoC URI', () => {
        mockLookupConstant([]);
        mockBFUrisConstant({ LINK: 'test_label_uri' });
        const spyGetMappedLookupValue = jest.spyOn(ProfileHelper, 'getMappedLookupValue');
        const testResult = uri;

        const result = generateLookupValue({ uriBFLite, label, uri, nonBFMappedGroup });

        expect(result).toEqual(testResult);
        expect(spyGetMappedLookupValue).not.toHaveBeenCalled();
      });
    });
  });

  describe('getMappedLookupValue', () => {
    test('returns the entire URI', () => {
      const result = getMappedLookupValue({ uri });

      expect(result).toEqual(uri);
    });

    test('returns the mapped URI', () => {
      mockTypeMapConstant({
        testPropertyURI: {
          field: {
            uri: '',
          },
          data: {
            testBFLiteUri: { uri: 'test_uri' },
          },
        },
      });

      const result = getMappedLookupValue({ uri, nonBFMappedGroup });

      expect(result).toEqual('testBFLiteUri');
    });

    test('returns the entire URI if the map does not contain a required value', () => {
      mockTypeMapConstant({
        testPropertyURI: {
          field: {
            uri: '',
          },
          data: {
            testBFLiteUri: { uri: 'non_mapped_test_uri' },
          },
        },
      });

      const result = getMappedLookupValue({ uri, nonBFMappedGroup });

      expect(result).toEqual(uri);
    });
  });

  describe('filterUserValues', () => {
    test('returns an empty object', () => {
      const userValues = {
        testId_1: { uuid: 'testId_1', contents: [] },
        testId_2: { uuid: 'testId_2', contents: [] },
      };

      const result = filterUserValues(userValues);

      expect(result).toEqual({});
    });

    test('returns an object with filtered user values', () => {
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
