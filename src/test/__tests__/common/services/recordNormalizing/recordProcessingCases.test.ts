import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';
import * as RecordProcessingCases from '@common/services/recordNormalizing/recordProcessingCases';
import * as BibframeMappingConstants from '@common/constants/bibframeMapping.constants';
import * as SchemaHelper from '@common/helpers/schema.helper';

const mockedBFLiteUris = getMockedImportedConstant(BibframeMappingConstants, 'BFLITE_URIS');

jest.mock('@common/helpers/schema.helper', () => ({
  getLookupLabelKey: jest.fn(),
}));

describe('recordProcessingCases', () => {
  const blockKey = 'block_1';
  const groupKey = 'group_1';
  const testLabel = 'testLabel';
  const fieldName = 'testFieldName';
  const noteBFLiteUri = 'noteBFLiteUri';
  const linkBFLiteUri = 'linkBFLiteUri';
  const labelBFLiteUri = 'labelBFLiteUri';
  const creatorBFLiteUri = 'creatorBFLiteUri';
  const noteNonBFUri = '_notes';

  mockedBFLiteUris({ NOTE: noteBFLiteUri, LINK: linkBFLiteUri, LABEL: labelBFLiteUri, CREATOR: creatorBFLiteUri });

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
      jest.spyOn(SchemaHelper, 'getLookupLabelKey').mockReturnValueOnce(testLabel);
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
      // With refactoring, we now use fixed "type" label for notes
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

  describe('processComplexLookup', () => {
    test('transforms entry with id and label', () => {
      const record = {
        [blockKey]: {
          [groupKey]: [
            {
              id: 'test_id_1',
              label: 'Test Label',
            },
          ],
        },
      } as unknown as RecordEntry;

      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              id: ['test_id_1'],
              _name: {
                value: ['Test Label'],
                isPreferred: undefined,
              },
            },
          ],
        },
      };

      RecordProcessingCases.processComplexLookup(record, blockKey, groupKey);

      expect(record).toEqual(testResult);
    });

    test('transforms entry with id, label, and type', () => {
      const record = {
        [blockKey]: {
          [groupKey]: [
            {
              id: 'test_id_1',
              label: 'Test Label',
              type: 'TestType',
            },
          ],
        },
      } as unknown as RecordEntry;

      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              id: ['test_id_1'],
              _name: {
                value: ['Test Label'],
                isPreferred: undefined,
              },
              _subclass: 'TestType',
            },
          ],
        },
      };

      RecordProcessingCases.processComplexLookup(record, blockKey, groupKey);

      expect(record).toEqual(testResult);
    });

    test('transforms entry with id, label, and preferred status', () => {
      const record = {
        [blockKey]: {
          [groupKey]: [
            {
              id: 'test_id_1',
              label: 'Test Label',
              isPreferred: true,
            },
          ],
        },
      } as unknown as RecordEntry;

      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              id: ['test_id_1'],
              _name: {
                value: ['Test Label'],
                isPreferred: true,
              },
            },
          ],
        },
      };

      RecordProcessingCases.processComplexLookup(record, blockKey, groupKey);

      expect(record).toEqual(testResult);
    });

    test('transforms entry with roles', () => {
      const record = {
        [blockKey]: {
          [groupKey]: [
            {
              id: 'test_id_1',
              label: 'Test Label',
              roles: ['role_1', 'role_2'],
            },
          ],
        },
      } as unknown as RecordEntry;

      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              id: ['test_id_1'],
              _name: {
                value: ['Test Label'],
                isPreferred: undefined,
              },
              roles: [
                {
                  [linkBFLiteUri]: ['role_1'],
                  [labelBFLiteUri]: [''],
                },
                {
                  [linkBFLiteUri]: ['role_2'],
                  [labelBFLiteUri]: [''],
                },
              ],
            },
          ],
        },
      };

      RecordProcessingCases.processComplexLookup(record, blockKey, groupKey);

      expect(record).toEqual(testResult);
    });

    test('transforms multiple entries with different combinations of fields', () => {
      const record = {
        [blockKey]: {
          [groupKey]: [
            {
              id: 'test_id_1',
              label: 'Label 1',
              type: 'Type_1',
              roles: ['role_1'],
            },
            {
              id: 'test_id_2',
              label: 'Label 2',
              isPreferred: true,
            },
          ],
        },
      } as unknown as RecordEntry;

      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              id: ['test_id_1'],
              _name: {
                value: ['Label 1'],
                isPreferred: undefined,
              },
              _subclass: 'Type_1',
              roles: [
                {
                  [linkBFLiteUri]: ['role_1'],
                  [labelBFLiteUri]: [''],
                },
              ],
            },
            {
              id: ['test_id_2'],
              _name: {
                value: ['Label 2'],
                isPreferred: true,
              },
            },
          ],
        },
      };

      RecordProcessingCases.processComplexLookup(record, blockKey, groupKey);

      expect(record).toEqual(testResult);
    });
  });
});
