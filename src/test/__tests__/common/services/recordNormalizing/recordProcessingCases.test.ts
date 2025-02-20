import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';
import * as RecordProcessingCases from '@common/services/recordNormalizing/recordProcessingCases';
import * as BibframeMappingConstants from '@common/constants/bibframeMapping.constants';

const mockedBFLiteUris = getMockedImportedConstant(BibframeMappingConstants, 'BFLITE_URIS');
const mockedNonBFRecordElements = getMockedImportedConstant(BibframeMappingConstants, 'NON_BF_RECORD_ELEMENTS');

describe('recordProcessingCases', () => {
  const blockKey = 'block_1';
  const groupKey = 'group_1';
  const testLabel = 'testLabel';
  const fieldName = 'testFieldName';
  const noteBFLiteUri = 'noteBFLiteUri';
  const linkBFLiteUri = 'linkBFLiteUri';
  const creatorBFLiteUri = 'creatorBFLiteUri';
  const noteNonBFUri = '_notes';
  const creatorNonBFUri = '_creator';

  mockedBFLiteUris({ NOTE: noteBFLiteUri, LINK: linkBFLiteUri, CREATOR: creatorBFLiteUri });
  mockedNonBFRecordElements({
    [noteBFLiteUri]: { container: noteNonBFUri },
    [creatorBFLiteUri]: { container: creatorNonBFUri },
  });

  describe('getLabelUri', () => {
    test('returns the correct label URI', () => {
      const blockKey = 'block_1';
      const groupKey = 'group_1';
      const fieldKey = 'field_1';
      const expectedLabel = 'testLabel';

      jest.spyOn(RecordProcessingCases, 'getLabelUri').mockReturnValueOnce(expectedLabel);

      const result = RecordProcessingCases.getLabelUri(blockKey, groupKey, fieldKey);

      expect(result).toBe(expectedLabel);
    });

    test('returns an empty string if label URI is not found', () => {
      const blockKey = 'block_1';
      const groupKey = 'group_1';
      const fieldKey = 'field_1';

      jest.spyOn(RecordProcessingCases, 'getLabelUri').mockReturnValueOnce('');

      const result = RecordProcessingCases.getLabelUri(blockKey, groupKey, fieldKey);

      expect(result).toBe('');
    });
  });

  describe('wrapWithContainer', () => {
    const container = 'groupContainer_1';

    test('wrap a group with a new container', () => {
      const record = {
        [blockKey]: {
          [groupKey]: [{ key_1: 'value 1' }, { key_1: 'value 2' }],
          group_2: {},
        },
        block_2: {},
      } as unknown as RecordEntry;
      const testResult = {
        [blockKey]: {
          [container]: [
            {
              [groupKey]: { key_1: 'value 1' },
            },
            {
              [groupKey]: { key_1: 'value 2' },
            },
          ],
          group_2: {},
        },
        block_2: {},
      };

      RecordProcessingCases.wrapWithContainer(record, blockKey, groupKey, container);

      expect(record).toEqual(testResult);
    });

    test('wrap a group with the existing container', () => {
      const groupKey_3 = 'group_3';
      const record = {
        [blockKey]: {
          [container]: [{ [groupKey]: {} }],
          group_2: {},
          [groupKey_3]: [{}],
        },
        block_2: {},
      } as unknown as RecordEntry;
      const testResult = {
        [blockKey]: {
          [container]: [{ [groupKey]: {} }, { [groupKey_3]: {} }],
          group_2: {},
        },
        block_2: {},
      };

      RecordProcessingCases.wrapWithContainer(record, blockKey, groupKey_3, container);

      expect(record).toEqual(testResult);
    });
  });

  describe('wrapSimpleLookupData', () => {
    test('updates a record with wrapped simple lookups data', () => {
      jest.spyOn(RecordProcessingCases, 'getLabelUri').mockReturnValueOnce(testLabel);
      const record = {
        [blockKey]: {
          [groupKey]: ['testField_1', 'testField_2'],
        },
      } as unknown as RecordEntry;
      const testResult = {
        [blockKey]: {
          [groupKey]: [{ testLabel: ['testField_1'] }, { testLabel: ['testField_2'] }],
        },
      };

      RecordProcessingCases.wrapSimpleLookupData(record, blockKey, groupKey);

      expect(record).toEqual(testResult);
    });
  });

  describe('notesMapping', () => {
    test('updates a record with "_notes" objects', () => {
      jest.spyOn(RecordProcessingCases, 'getLabelUri').mockReturnValueOnce(testLabel);
      const record = {
        [blockKey]: {
          [noteNonBFUri]: [
            {
              label: ['testNoteLabel_1'],
              type: ['testNoteType_1'],
            },
            {
              label: ['testNoteLabel_2'],
              type: ['testNoteType_2'],
            },
          ],
        },
      } as unknown as RecordEntry;

      const testResult = {
        [blockKey]: {
          [noteNonBFUri]: [
            {
              label: ['testNoteLabel_1'],
              type: [
                {
                  [linkBFLiteUri]: ['testNoteType_1'],
                  [testLabel]: [''],
                },
              ],
            },
            {
              label: ['testNoteLabel_2'],
              type: [
                {
                  [linkBFLiteUri]: ['testNoteType_2'],
                  [testLabel]: [''],
                },
              ],
            },
          ],
        },
      };

      RecordProcessingCases.notesMapping(record, blockKey);

      expect(record).toEqual(testResult);
    });
  });

  describe('extractValue', () => {
    test('updates a record with extracted value', () => {
      const source = 'testFieldName';
      const record = {
        [blockKey]: {
          [groupKey]: [{ [source]: 'testValue_1' }, { [source]: 'testValue_2' }],
        },
      } as unknown as RecordEntry;
      const testResult = {
        [blockKey]: {
          [groupKey]: ['testValue_1', 'testValue_2'],
        },
      };

      RecordProcessingCases.extractValue(record, blockKey, groupKey, source);

      expect(record).toEqual(testResult);
    });
  });

  describe('processComplexGroupValues', () => {
    test('updates a record with processed values for Complex groups', () => {
      const record = {
        [blockKey]: {
          [groupKey]: [{ key: ['testValue_1'] }, { key: ['testValue_2'] }],
        },
      } as unknown as RecordEntry;
      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              [fieldName]: { key: ['testValue_1'] },
            },
            {
              [fieldName]: { key: ['testValue_2'] },
            },
          ],
        },
      };

      RecordProcessingCases.processComplexGroupValues(record, blockKey, groupKey, fieldName);

      expect(record).toEqual(testResult);
    });
  });

  describe('processCreator', () => {
    test('updates a record with processed "creator" field', () => {
      jest.spyOn(RecordProcessingCases, 'getLabelUri').mockReturnValueOnce(testLabel);

      const record = {
        [blockKey]: {
          [groupKey]: [
            {
              id: 'id_1',
              type: 'dropdownOption_1',
              label: 'testValue_1',
              [creatorNonBFUri]: ['creatorValue_1', 'creatorValue_2'],
            },
            {
              id: 'id_2',
              type: 'dropdownOption_2',
              label: 'testValue_2',
              isPreferred: true,
            },
            {
              id: 'id_3',
              type: 'dropdownOption_3',
              label: 'testValue_3',
              [creatorNonBFUri]: ['creatorValue_3'],
            },
          ],
        },
      } as unknown as RecordEntry;
      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              dropdownOption_1: {
                id: ['id_1'],
                label: {
                  value: ['testValue_1'],
                  isPreferred: undefined,
                },
                [creatorNonBFUri]: [
                  {
                    [testLabel]: [''],
                    [linkBFLiteUri]: ['creatorValue_1'],
                  },
                  {
                    [testLabel]: [''],
                    [linkBFLiteUri]: ['creatorValue_2'],
                  },
                ],
              },
            },
            {
              dropdownOption_2: {
                id: ['id_2'],
                label: {
                  value: ['testValue_2'],
                  isPreferred: true,
                },
              },
            },
            {
              dropdownOption_3: {
                id: ['id_3'],
                label: {
                  value: ['testValue_3'],
                  isPreferred: undefined,
                },
                [creatorNonBFUri]: [
                  {
                    [testLabel]: [''],
                    [linkBFLiteUri]: ['creatorValue_3'],
                  },
                ],
              },
            },
          ],
        },
      };

      RecordProcessingCases.processCreator(record, blockKey, groupKey);

      expect(record).toEqual(testResult);
    });
  });

  describe('processComplexGroupWithLookup', () => {
    test('updates a record with a complex group which contain simple lookup fields', () => {
      jest.spyOn(RecordProcessingCases, 'getLabelUri').mockReturnValueOnce(testLabel);
      const record = {
        [blockKey]: {
          [groupKey]: [
            {
              [testLabel]: ['testValue_1'],
              [linkBFLiteUri]: ['testLanguageUri_1'],
            },
            {
              [testLabel]: ['testValue_2'],
              [linkBFLiteUri]: ['testLanguageUri_2'],
            },
          ],
        },
      } as unknown as RecordEntry;
      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              [fieldName]: {
                [testLabel]: ['testValue_1'],
                [linkBFLiteUri]: ['testLanguageUri_1'],
              },
            },
            {
              [fieldName]: {
                [testLabel]: ['testValue_2'],
                [linkBFLiteUri]: ['testLanguageUri_2'],
              },
            },
          ],
        },
      };

      RecordProcessingCases.processComplexGroupWithLookup(record, blockKey, groupKey, fieldName);

      expect(record).toEqual(testResult);
    });
  });

  describe('extractDropdownOption', () => {
    test('updates a record with extracted dropdown options', () => {
      const lookupKey = 'lookupKey';
      const record = {
        [blockKey]: {
          [groupKey]: [
            {
              field_1: ['testValue_1'],
              [fieldName]: ['testFieldValue_2'],
              [lookupKey]: [{ id: 'id_1', label: 'label_1' }],
            },
            {
              field_2: ['testValue_3'],
              [fieldName]: ['testFieldValue_4'],
              [lookupKey]: [{ id: 'id_2', label: 'label_2' }],
            },
          ],
        },
      } as unknown as RecordEntry;
      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              testFieldValue_2: {
                field_1: ['testValue_1'],
                [lookupKey]: [{ id: 'id_1', label: ['label_1'] }],
              },
            },
            {
              testFieldValue_4: {
                field_2: ['testValue_3'],
                [lookupKey]: [{ id: 'id_2', label: ['label_2'] }],
              },
            },
          ],
        },
      };

      RecordProcessingCases.extractDropdownOption(record, blockKey, groupKey, fieldName, lookupKey);

      expect(record).toEqual(testResult);
    });
  });
});
