import * as RecordHelper from '@common/helpers/record.helper';
import * as ProgressBackupHelper from '@common/helpers/progressBackup.helper';
import { localStorageService } from '@common/services/storage';
import { AUTOCLEAR_TIMEOUT } from '@common/constants/storage.constants';
import * as BibframeConstants from '@src/common/constants/bibframe.constants';
import * as BibframeMappingConstants from '@common/constants/bibframeMapping.constants';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';

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
  const testInstanceUri = 'testInstanceUri';
  const testInstantiatesUri = 'testInstantiatesUri';
  const testInstantiatesToInstanceUri = 'testInstantiatesToInstanceUri';
  const mockTypeUriConstant = getMockedImportedConstant(BibframeConstants, 'TYPE_URIS');
  const mockInstantiatesToInstanceConstant = getMockedImportedConstant(
    BibframeConstants,
    'INSTANTIATES_TO_INSTANCE_FIELDS',
  );
  const mockBFLiteUriConstant = getMockedImportedConstant(BibframeMappingConstants, 'BFLITE_URIS');
  const mockNonBFRecordElementsConstant = getMockedImportedConstant(BibframeMappingConstants, 'NON_BF_RECORD_ELEMENTS');
  mockTypeUriConstant({ INSTANCE: testInstanceUri });
  mockInstantiatesToInstanceConstant([]);
  mockBFLiteUriConstant({ INSTANTIATES: testInstantiatesUri, NOTE: 'testNoteUri' });
  mockNonBFRecordElementsConstant({ testNoteUri: { container: '_notes' } });

  beforeEach(() => {
    jest.spyOn(ProgressBackupHelper, 'generateRecordBackupKey').mockReturnValue(key);
  });

  describe('formatRecord', () => {
    function testFormatRecord(initialRecord: ParsedRecord, testResult: Record<string, object | string>) {
      const result = RecordHelper.formatRecord(initialRecord);

      expect(result).toEqual(testResult);
    }

    test('returns formatted record data', () => {
      const initialRecord = {
        [testInstanceUri]: {},
      };
      const testResult = {
        resource: {
          [testInstanceUri]: {},
        },
      };

      testFormatRecord(initialRecord, testResult);
    });

    test('embeds work entity into instance if there is data for work entity', () => {
      const workComponent = {
        testUri: 'testValue',
      };
      const initialRecord = {
        [testInstanceUri]: {},
        [testInstantiatesUri]: workComponent,
      };
      const testResult = {
        resource: {
          [testInstanceUri]: {
            [testInstantiatesUri]: [workComponent],
          },
        },
      };

      testFormatRecord(initialRecord, testResult);
    });

    test("doesn't embed work entity into instance if it's empty", () => {
      const workComponent = {};
      const initialRecord = {
        [testInstanceUri]: {},
        [testInstantiatesUri]: workComponent,
      };
      const testResult = {
        resource: {
          [testInstanceUri]: workComponent,
        },
      };

      testFormatRecord(initialRecord, testResult);
    });
  });

  describe('updateInstantiatesWithInstanceFields', () => {
    test('returns initial Instance object', () => {
      const instance = {
        [testInstantiatesUri]: [{}],
      } as unknown as Record<string, RecursiveRecordSchema>;

      const result = RecordHelper.updateInstantiatesWithInstanceFields(instance);

      expect(result).toEqual(instance);
    });

    test('returns updated Instance object that contained Instantiates', () => {
      mockInstantiatesToInstanceConstant([testInstantiatesToInstanceUri]);
      const instance = {
        [testInstantiatesUri]: [{ existingKey_1: ['existingUri_1'] }],
        [testInstantiatesToInstanceUri]: ['testUri_1', 'testUri_2'],
      } as unknown as Record<string, RecursiveRecordSchema[]>;
      const testResult = {
        [testInstantiatesUri]: [
          {
            existingKey_1: ['existingUri_1'],
            [testInstantiatesToInstanceUri]: ['testUri_1', 'testUri_2'],
          },
        ],
      };

      const result = RecordHelper.updateInstantiatesWithInstanceFields(instance);

      expect(result).toEqual(testResult);
    });

    test('returns initial Instance object that did not contain Instantiates', () => {
      mockInstantiatesToInstanceConstant([testInstantiatesToInstanceUri]);
      const instance = {
        [testInstantiatesToInstanceUri]: ['testUri_1', 'testUri_2'],
      } as unknown as Record<string, RecursiveRecordSchema[]>;
      const testResult = {
        [testInstantiatesUri]: [
          {
            [testInstantiatesToInstanceUri]: ['testUri_1', 'testUri_2'],
          },
        ],
      };

      const result = RecordHelper.updateInstantiatesWithInstanceFields(instance);

      expect(result).toEqual(testResult);
    });
  });

  describe('updateRecordWithDefaultNoteType', () => {
    test('returns initial record', () => {
      const record = {
        _notes: [
          {
            value: ['note description 1'],
            type: ['testType_1'],
          },
          {
            value: ['note description 2'],
            type: ['testType_2'],
          },
        ],
      };

      const result = RecordHelper.updateRecordWithDefaultNoteType(record);

      expect(result).toEqual(record);
    });

    test('returns a record with a default Note type', () => {
      const record = {
        _notes: [
          {
            value: ['note description 1'],
            type: ['testType_1'],
          },
          {
            value: ['note description 2'],
          },
        ],
      } as Record<string, RecursiveRecordSchema[]>;
      const testResult = {
        _notes: [
          {
            value: ['note description 1'],
            type: ['testType_1'],
          },
          {
            value: ['note description 2'],
            type: ['testNoteUri'],
          },
        ],
      };

      const result = RecordHelper.updateRecordWithDefaultNoteType(record);

      expect(result).toEqual(testResult);
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
    const record = { [testInstanceUri]: {} };
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
});
