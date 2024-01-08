import * as LookupOptionsHelper from '@common/helpers/lookupOptions.helper';
import * as LookupConstants from '@common/constants/lookup.constants';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';

const { formatLookupOptions, filterLookupOptionsByMappedValue, filterLookupOptionsByParentBlock } = LookupOptionsHelper;
const lookupData = [
  {
    label: 'testLabel_1',
    __isNew__: false,
    value: {
      id: 'testId_1',
      label: 'testLabel_1',
      uri: 'testUri_1',
    },
  },
  {
    label: 'testLabel_2',
    __isNew__: false,
    value: {
      id: 'testId_2',
      label: 'testLabel_2',
      uri: 'testUri_2',
    },
  },
];
const propertyURI = 'testPropertyUri';

describe('lookupOptions.helper', () => {
  const mockImportedLabelUriConstant = getMockedImportedConstant(LookupConstants, 'AUTHORITATIVE_LABEL_URI');

  describe('formatLookupOptions', () => {
    test('returns empty array', () => {
      const result = formatLookupOptions();

      expect(result).toHaveLength(0);
    });

    test('returns formatted array', () => {
      mockImportedLabelUriConstant('@testLabelUri');

      const data = [
        {
          '@id': 'id_1',
          '@type': ['type_1'],
          '@testLabelUri': [
            {
              '@id': 'testId_1',
              '@value': 'value_1',
              '@language': 'lang_1',
              '@type': 'type_1',
            },
          ],
        },
        {
          '@id': 'parentUri_1:_test',
          '@type': ['type_2'],
          '@testLabelUri': [
            {
              '@id': 'parentUri_1:_test',
              '@value': 'value_2',
              '@language': 'lang_2',
              '@type': 'type_2',
            },
          ],
        },
      ] as unknown as LoadSimpleLookupResponseItem[];
      const parentUri = 'parentUri_1:_test';
      const testResult = [
        {
          __isNew__: false,
          label: 'value_1',
          value: {
            label: 'value_1',
            uri: 'id_1',
          },
        },
      ] as unknown as LoadSimpleLookupResponseItem[];

      const result = formatLookupOptions(data, parentUri);

      expect(result).toEqual(testResult);
    });
  });

  describe('filterLookupOptionsByMappedValue', () => {
    test('returns an array with the entire lookup options if "propertyURI" is not provided', () => {
      const result = filterLookupOptionsByMappedValue(lookupData);

      expect(result).toEqual(lookupData);
    });

    test('returns an array with the filtered lookup options', () => {
      jest.spyOn(LookupOptionsHelper, 'getBFGroup').mockReturnValue({
        field: {
          uri: 'testNotesUri',
        },
        data: {
          blLiteUri_1: { uri: 'testUri_1' },
        },
      });
      const testResult = [
        {
          label: 'testLabel_1',
          __isNew__: false,
          value: {
            id: 'testId_1',
            label: 'testLabel_1',
            uri: 'testUri_1',
          },
        },
      ];

      const result = filterLookupOptionsByMappedValue(lookupData, propertyURI);

      expect(result).toEqual(testResult);
    });
  });

  describe('filterLookupOptionsByParentBlock', () => {
    const parentBlockUri = 'testParentBlockUri_1';

    test('returns undefined if "lookupData" is not provided', () => {
      const result = filterLookupOptionsByParentBlock();

      expect(result).toBeUndefined();
    });

    test('returns an array with the entire lookup options if "propertyURI" is not provided', () => {
      const result = filterLookupOptionsByParentBlock(lookupData);

      expect(result).toEqual(lookupData);
    });

    test('returns an array with the entire lookup options if "parentBlockUri" is not provided', () => {
      const result = filterLookupOptionsByParentBlock(lookupData, propertyURI);

      expect(result).toEqual(lookupData);
    });

    test('returns an array with the filtered lookup options', () => {
      jest.spyOn(LookupOptionsHelper, 'getBFGroup').mockReturnValue({
        field: {
          uri: 'testNotesUri',
        },
        data: {
          blLiteUri_1: { uri: 'testUri_1', parentBlock: { bfLiteUri: 'testParentBlockUri_1' } },
          blLiteUri_2: { uri: 'testUri_2', parentBlock: { bfLiteUri: 'testParentBlockUri_2' } },
        },
      });

      const testResult = [
        {
          label: 'testLabel_1',
          __isNew__: false,
          value: {
            id: 'testId_1',
            label: 'testLabel_1',
            uri: 'testUri_1',
          },
        },
      ];

      const result = filterLookupOptionsByParentBlock(lookupData, propertyURI, parentBlockUri);

      expect(result).toEqual(testResult);
    });
  });
});
