import { formatLookupOptions } from '@common/helpers/lookupOptions.helper';
import * as LookupConstants from '@common/constants/lookup.constants';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';

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
});
