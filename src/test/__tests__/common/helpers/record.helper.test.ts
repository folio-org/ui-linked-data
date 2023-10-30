import * as RecordHelper from '@common/helpers/record.helper';
import * as ProgressBackupHelper from '@common/helpers/progressBackup.helper';
import { localStorageService } from '@common/services/storage';
import { AUTOCLEAR_TIMEOUT } from '@common/constants/storage.constants';
import * as BibframeConstants from '@src/common/constants/bibframe.constants';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';
import { BFLITE_URIS } from '@common/constants/bibframeMapping.constants';

describe('record.helper', () => {
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

  beforeEach(() => {
    jest.spyOn(ProgressBackupHelper, 'generateRecordBackupKey').mockReturnValue(key);
  });

  describe('formatRecord', () => {
    function testFormatRecord(
      initialRecord: Record<string, object> | RecordEntry,
      testResult: Record<string, object | string>,
    ) {
      const result = RecordHelper.formatRecord(initialRecord);

      expect(result).toEqual(testResult);
    }

    test('returns formatted record data', () => {
      const initialRecord = {
        Instance: {},
      };
      const testResult = {
        resource: {
          Instance: {},
        },
      };

      testFormatRecord(initialRecord, testResult);
    });

    test('embeds work entity into instance if there is data for work entity', () => {
      const workComponent = 
        {
          testUri: 'testValue',
        };
      const initialRecord = {
        [BibframeConstants.TYPE_URIS.INSTANCE]: {},
        [BFLITE_URIS.INSTANTIATES]: workComponent,
      };
      const testResult = {
        resource: {
          [BibframeConstants.TYPE_URIS.INSTANCE]: {
            [BFLITE_URIS.INSTANTIATES]: [workComponent],
          },
        },
      };

      testFormatRecord(initialRecord, testResult);
    });

    test("doesn't embed work entity into instance if it's empty", () => {
      const workComponent = {};
      const initialRecord = {
        [BibframeConstants.TYPE_URIS.INSTANCE]: {},
        [BFLITE_URIS.INSTANTIATES]: workComponent,
      };
      const testResult = {
        resource: {
          [BibframeConstants.TYPE_URIS.INSTANCE]: workComponent,
        },
      };

      testFormatRecord(initialRecord, testResult);
    });
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
    const testInstanceUri = 'testInstanceUri';
    const mockImportedConstant = getMockedImportedConstant(BibframeConstants, 'TYPE_URIS');
    mockImportedConstant({ INSTANCE: testInstanceUri });
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

    const result = RecordHelper.saveRecordLocally(profile, record, recordId);

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
});
