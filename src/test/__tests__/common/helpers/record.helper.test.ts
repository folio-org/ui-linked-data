import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';
import * as RecordHelper from '@common/helpers/record.helper';
import * as BibframeConstants from '@src/common/constants/bibframe.constants';
import * as BibframeMappingConstants from '@src/common/constants/bibframeMapping.constants';

describe('record.helper', () => {
  const mockBlocksBFLiteConstant = getMockedImportedConstant(BibframeMappingConstants, 'BLOCKS_BFLITE');

  const testInstanceUri = 'testInstanceUri';
  const mockTypeUriConstant = getMockedImportedConstant(BibframeConstants, 'TYPE_URIS');
  mockTypeUriConstant({ INSTANCE: testInstanceUri });

  describe('getEditingRecordBlocks', () => {
    test("returns an object with the record's blocks", () => {
      mockBlocksBFLiteConstant({
        INSTANCE: {
          uri: 'testInstanceUri',
          reference: {
            key: 'workReferenceKey',
            uri: 'testWorkUri',
          },
        },
        WORK: {
          uri: 'testWorkUri',
          reference: {
            key: 'instanceReferenceKey',
            uri: 'testInstanceUri',
          },
        },
      });
      const record = {
        testInstanceUri: {
          testFieldUri_1: [],
          testFieldUri_2: [],
          workReferenceKey: [
            {
              testWorkFieldUri_1: [],
              id: ['testWorkId'],
            },
          ],
        },
      } as unknown as RecordEntry;
      const testResult = {
        block: 'testInstanceUri',
        reference: {
          key: 'workReferenceKey',
          uri: 'testWorkUri',
        },
      };

      const result = RecordHelper.getEditingRecordBlocks(record);

      expect(result).toEqual(testResult);
    });
  });

  describe('getRecordTitle', () => {
    const mockMainTitle = '80085';
    const mockRecord = {
      testInstanceUri: {
        'http://bibfra.me/vocab/marc/title': [
          {
            'http://bibfra.me/vocab/marc/Title': {
              'http://bibfra.me/vocab/marc/mainTitle': [mockMainTitle],
            },
          },
        ],
      },
    };

    test('returns title', () => {
      expect(RecordHelper.getRecordTitle(mockRecord as unknown as RecordEntry)).toBe(mockMainTitle);
    });
  });

  describe('getRecordDependencies', () => {
    test("doesn't work if there's no record", () => {
      expect(RecordHelper.getRecordDependencies(null)).toBeFalsy();
    });

    test('returns record dependencies', () => {
      const record = {
        testInstanceUri: {
          testFieldUri_1: [],
          testFieldUri_2: [],
          workReferenceKey: [
            {
              testWorkFieldUri_1: [],
              id: ['testWorkId'],
            },
          ],
        },
      } as unknown as RecordEntry;

      jest.spyOn(RecordHelper, 'getEditingRecordBlocks').mockReturnValue({
        block: 'testInstanceUri',
        reference: {
          key: 'workReferenceKey',
          uri: 'testWorkUri',
        },
      });

      expect(RecordHelper.getRecordDependencies(record)).toEqual({
        entries: [{ id: ['testWorkId'], testWorkFieldUri_1: [] }],
        keys: { key: 'workReferenceKey', uri: 'testWorkUri' },
        type: undefined,
      });
    });
  });
});
