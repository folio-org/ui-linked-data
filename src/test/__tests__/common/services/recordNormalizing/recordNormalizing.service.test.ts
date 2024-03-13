import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';
import { RecordNormalizingService } from '@common/services/recordNormalizing';
import * as BfMappingConstants from '@common/constants/bibframeMapping.constants';
import * as RecordProcessingMap from '@common/services/recordNormalizing/recordProcessingMap';

describe('RecordNormalizingService', () => {
  const testInstanceBlock = 'testInstanceBlock';
  const testWorkBlock = 'testWorkBlock';
  const reference = { key: 'testWorkBlock', uri: 'testReferenceUri' };
  const mockedBlockUrisBfLiteConstants = getMockedImportedConstant(BfMappingConstants, 'BLOCK_URIS_BFLITE');
  const mockedRecordNormalizingCases = getMockedImportedConstant(RecordProcessingMap, 'RECORD_NORMALIZING_CASES');
  mockedBlockUrisBfLiteConstants({ INSTANCE: testInstanceBlock, WORK: testWorkBlock });
  mockedRecordNormalizingCases({
    testField_2: {
      process: (record: RecordEntry, blockKey: string, groupKey: string) => {
        record[blockKey][groupKey] = (record?.[blockKey]?.[groupKey] as unknown as string[]).map(entry => ({
          label: entry,
          uri: 'testUri_1',
        })) as unknown as RecursiveRecordSchema;
      },
    },
  });

  test('generates normalized record', () => {
    const record = {
      [testInstanceBlock]: {
        testField_1: ['testInstanceFieldValue_1'],
        testField_2: ['testInstanceFieldValue_2'],
        [testWorkBlock]: [
          {
            testWorkField_1: ['testWorkFieldValue_1'],
            testWorkField_2: ['testWorkFieldValue_2'],
          },
        ],
      },
    } as unknown as RecordEntry;
    const testResult = {
      testInstanceBlock: {
        testField_1: ['testInstanceFieldValue_1'],
        testField_2: [
          {
            label: 'testInstanceFieldValue_2',
            uri: 'testUri_1',
          },
        ],
      },
      testReferenceUri: {
        testWorkField_1: ['testWorkFieldValue_1'],
        testWorkField_2: ['testWorkFieldValue_2'],
      },
    };

    const recordNormalizingService = new RecordNormalizingService(record, testInstanceBlock, reference);
    const result = recordNormalizingService.get();

    expect(result).toEqual(testResult);
  });
});
