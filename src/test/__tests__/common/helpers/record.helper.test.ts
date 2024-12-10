import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';
import * as RecordHelper from '@common/helpers/record.helper';
import * as ProgressBackupHelper from '@common/helpers/progressBackup.helper';
import { localStorageService } from '@common/services/storage';
import { AUTOCLEAR_TIMEOUT } from '@common/constants/storage.constants';
import * as BibframeConstants from '@src/common/constants/bibframe.constants';
import * as BibframeMappingConstants from '@src/common/constants/bibframeMapping.constants';

describe('record.helper', () => {
  const mockBlocksBFLiteConstant = getMockedImportedConstant(BibframeMappingConstants, 'BLOCKS_BFLITE');

  const profile = 'test:profile:id';
  const recordId = 'testRecordId';
  const key = 'testKey';
  const record = {
    [profile]: {
      Instance: [{}],
    },
  };
  const date = 111111111;
  const storedRecord = {
    createdAt: date,
    data: record,
  };
  const testInstanceUri = 'testInstanceUri';
  const mockTypeUriConstant = getMockedImportedConstant(BibframeConstants, 'TYPE_URIS');
  mockTypeUriConstant({ INSTANCE: testInstanceUri });

  beforeEach(() => {
    jest.spyOn(ProgressBackupHelper, 'generateRecordBackupKey').mockReturnValue(key);
  });

  test('deleteRecordLocally - invokes "localStorageService.delete" with generated key', () => {
    localStorageService.delete = jest.fn().mockImplementationOnce(data => data);

    RecordHelper.deleteRecordLocally(profile, recordId);

    expect(localStorageService.delete).toHaveBeenCalledWith(key);
  });

  test('generateRecordData - returns generated data for payload', () => {
    jest.spyOn(Date.prototype, 'getTime').mockReturnValue(date);

    const result = RecordHelper.generateRecordData(record);

    expect(result).toEqual(storedRecord);
  });

  test('generateAndSaveRecord - invokes "localStorageService.serialize" and returns generated record', () => {
    jest.spyOn(RecordHelper, 'generateRecordData').mockReturnValue(storedRecord);
    localStorageService.serialize = jest.fn().mockImplementationOnce((_, record) => record);

    const result = RecordHelper.generateAndSaveRecord(key, record);

    expect(localStorageService.serialize).toHaveBeenCalledWith(key, storedRecord);
    expect(result).toEqual(storedRecord);
  });

  test('saveRecordLocally - invokes "generateAndSaveRecord" and returns its result', () => {
    const parsedRecord = { [testInstanceUri]: {} };
    const record = { resource: { [testInstanceUri]: {} } };
    const testRecord = {
      resource: { [testInstanceUri]: { id: 'testId' } },
    };
    const storedRecord = {
      createdAt: date,
      data: testRecord,
    };

    jest.spyOn(RecordHelper, 'getRecordWithUpdatedID').mockReturnValue(testRecord);
    jest.spyOn(RecordHelper, 'generateAndSaveRecord').mockReturnValue(storedRecord);

    const result = RecordHelper.saveRecordLocally({ profile, parsedRecord, record });

    expect(RecordHelper.generateAndSaveRecord).toHaveBeenCalledWith(key, testRecord);
    expect(result).toEqual(storedRecord);
  });

  describe('getSavedRecord', () => {
    test('returns null', () => {
      localStorageService.deserialize = jest.fn().mockReturnValue(undefined);

      const result = RecordHelper.getSavedRecord(profile, recordId);

      expect(result).toBeNull();
    });

    test('invokes "generateAndSaveRecord" and returns its value', () => {
      localStorageService.deserialize = jest.fn().mockReturnValue(record);
      jest.spyOn(RecordHelper, 'generateAndSaveRecord').mockReturnValue(storedRecord);

      const result = RecordHelper.getSavedRecord(profile, recordId);

      expect(RecordHelper.generateAndSaveRecord).toHaveBeenCalledWith(key, record);
      expect(result).toEqual(storedRecord);
    });

    test('invokes "autoClearSavedData" and returns its value', () => {
      localStorageService.deserialize = jest.fn().mockReturnValue(storedRecord);
      jest.spyOn(RecordHelper, 'autoClearSavedData').mockReturnValue(storedRecord);

      const result = RecordHelper.getSavedRecord(profile, recordId);

      expect(RecordHelper.autoClearSavedData).toHaveBeenCalledWith(storedRecord, profile, recordId);
      expect(result).toEqual(storedRecord);
    });
  });

  describe('autoClearSavedData', () => {
    test('returns initial data', () => {
      jest.spyOn(Date.prototype, 'getTime').mockReturnValue(date);

      const result = RecordHelper.autoClearSavedData(storedRecord, profile, recordId);

      expect(result).toEqual(storedRecord);
    });

    test('invokes "deleteRecordLocally" and returns null', () => {
      jest.spyOn(Date.prototype, 'getTime').mockReturnValue(date + AUTOCLEAR_TIMEOUT);
      jest.spyOn(RecordHelper, 'deleteRecordLocally');

      const result = RecordHelper.autoClearSavedData(storedRecord, profile, recordId);

      expect(RecordHelper.deleteRecordLocally).toHaveBeenCalledWith(profile, recordId);
      expect(result).toBeNull();
    });
  });

  describe('checkIdentifierAsValue', () => {
    const mockedIdentifierAsValueConstant = {
      sampleUri: {
        field: 'sampleField',
        value: 'sampleValue',
      },
    };

    beforeEach(() => {
      const mockImportedConstant = getMockedImportedConstant(BibframeConstants, 'IDENTIFIER_AS_VALUE');
      mockImportedConstant(mockedIdentifierAsValueConstant);
    });

    test('returns false if no identifier as value selection', () => {
      expect(RecordHelper.checkIdentifierAsValue({}, 'nonExistentUri')).toEqual(false);
    });

    test('returns false if identifier as value present but no corresponding value in record', () => {
      expect(RecordHelper.checkIdentifierAsValue({}, 'sampleUri')).toEqual(false);
    });

    test('returns record if identifier as value and corresponding value in record present', () => {
      expect(RecordHelper.checkIdentifierAsValue({ sampleField: ['sampleValue'] }, 'sampleUri')).toEqual({
        sampleField: ['sampleValue'],
      });
    });
  });

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
